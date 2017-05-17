## Realtime Database Schema
```
/accounts
    /<USER-ID>
        admin = {null|bool}
        email = {string}
        githubCreatedAt = {server timestamp}
        githubToken = {string}
        profileNeedsUpdate = {null|bool}
        updatedAt = {server timestamp}
        /events
            /<EVENT-ID>
                name = {string}
                location = {string}
                startAt = {int: epoch seconds}
                endAt = {int: epoch seconds}
                /topic
                    id = {string}
                    name = {string}
/profiles
    /<USER-ID>
        uid = {string}
        name = {string}
        handle = {string}
        photo = {null|string}
/requests
    /<EVENT-ID>
        <USER-ID> = true
/events
    /<EVENT-ID>
        name = {string}
        location = {string}
        state = {string: open|closed}
        startAt = {int: epoch seconds}
        endAt = {int: epoch seconds}
/assignments
    /<EVENT-ID>
        /<TOPIC-ID>
            name = {string}
            /members
                <USER-ID> = true
/updateProfileQueue
    /<USER-ID>
        createdAt = {int: epoch seconds}
        updatedAt = {int: epoch seconds}
```
* `/account` - private information for each user, including their GitHub OAuth token and the events they have signed up for. `/topic` will only be present in a slot once a topic has been assigned by the matching algorithm.
* `/profile` - public information for each user.
* `/requests` - lists of users who have signed up for events, to be used by the matching algorithm.
* `/events` - all events (past, present, and future). Clients should primarily query this by `startAt`.
* `/assignments` - assignments made by the matching algorithm.
* `/updateProfileQueue` - storage for the [reliable profile updating mechanism](profile.md).
