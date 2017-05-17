# Reliable Profile Updates
## Overview
Building a user profile in Hubbub involves accessing a 3rd party API (GitHub) and executing Cloud Functions that may not complete successfully. This document describes the mechanism that is implemented in order to guarantee a profile gets built *eventually* as long as the oauth token remains valid.

## Architecture
The system consists of two primary components: a queue and a periodically invoked Cloud Function (cron).
1. **Queue** - The queue is implemented in the Firebase Realtime Database and maintains a list of users that require their profile to be updated.
1. **Cron** - An HTTP Cloud Function will be run periodically (i.e. once per minute) via https://cron-job.org. It will repair missing database entries caused by Cloud Function failures, and restart any stale jobs in the queue.

## RTDB Schema
```
/accounts
    /<USER-ID>
        githubToken = {string}
        profileNeedsUpdate = {null|bool}
/updateProfileQueue
    /<USER-ID>
        createdAt = {int: epoch seconds}
        updatedAt = {int: epoch seconds}
```

## Database Triggers
| Cloud Function               | Trigger                                                |
|------------------------------|--------------------------------------------------------|
| `enqueueUpdateProfileLegacy` | `ref('/accounts/{userId}/githubToken').onWrite`        |
| `enqueueUpdateProfile`       | `ref('/accounts/{userId}/profileNeedsUpdate').onWrite` |
| `updateProfile`              | `ref('/updateProfileQueue/{userId}').onWrite`          |

## Flow (assuming success)
#### Legacy Clients
1. The client writes `githubToken=<token>` which triggers `enqueueUpdateProfileLegacy()`
2. `enqueueUpdateProfileLegacy()` writes `profileNeedsUpdate=true` which triggers `enqueueUpdateProfile()`
3. Continue at step (2) below

#### Updated Clients
1. The client writes `githubToken=<token>` and `profileNeedsUpdate=true` which triggers `enqueueUpdateProfile()`
2. `enqueueUpdateProfile()` writes an entry into `/userProfileQueue` with `createdAt=<now>` and `updatedAt=<now>` which triggers `updateProfile()`
3. `updateProfile()` uses the GitHub API to fetch the necessary data and saves it to the database. On success or permanent failure (i.e. expired token), it makes the following changes atomically:
    1. Delete the entry in `/userProfileQueue`
    2. Set `profileNeedsUpdate=false`

## Cron
Errors can occur at any step in the flow, and we need to be able to recover from them. The cron function identifies each of the possible errors and repairs or retries as necessary:
1. Fix `enqueueUpdateProfileLegacy()` errors
    1. Find all users where `profileNeedsUpdate=null`
    2. Set `profileNeedsUpdate` to `true` if `githubToken` is present, otherwise `false`
2. Fix `enqueueUpdateProfile()` errors
    1. Find all users where `profileNeedsUpdate=true`
    2. If the user does not have an entry in the queue, create one with `createdAt=<now>` and `updatedAt=<now>`
3. Fix `updateProfile()` errors
    1. Find all queue entries with an `updatedAt` timestamp older than 2 minutes (i.e. the "stale time")
    2. Set `updatedAt=<now>`, which will trigger `updateProfile()` to run again
