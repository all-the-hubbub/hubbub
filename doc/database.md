## Realtime Database Schema
```
/accounts
    /<USER-ID>
        githubToken = {string}
        email = {string}
        updatedAt = {server timestamp}
        githubCreatedAt = {server timestamp}
        /slots
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
    /<SLOT-ID>
        /<TOPIC-ID>
            name = {string}
            /members
                <USER-ID> = true
```
* `/account` - private information for each user, including their GitHub OAuth token and the lunch slots they have signed up for. `/topic` will only be present in a slot once a topic has been assigned by the matching algorithm.
* `/profile` - public information for each user.
* `/requests` - lists of users who have signed up for lunch slots, to be used by the matching algorithm.
* `/events` - all lunch slots (past, present, and future). Clients should primarily query this by `timestamp`.
* `/assignments` - assignments made by the matching algorithm.
