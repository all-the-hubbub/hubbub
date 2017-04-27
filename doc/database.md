## Realtime Database Schema
```
/account
    /<USER-ID>
        token = {string}
        /slots
            /<SLOT-ID>
                timestamp = {int: epoch seconds}
                topicId = {null|string}
/profile
    /<USER-ID>
        name = {string}
        handle = {string}
        photo = {null|string}
/requests
    /<SLOT-ID>
        <USER-ID> = true
/slots
    /<SLOT-ID>
        name = {string}
        state = {string: open|closed}
        timestamp = {int: epoch seconds}
/topics
    /<SLOT-ID>
        /<TOPIC-ID>
            name = {string}
            /members
                <USER-ID> = true
```
* `/account` - private information for each user, including their GitHub OAuth token and the lunch slots they have signed up for. `topicId` will only be present once a topic has been assigned by the matching algorithm.
* `/profile` - public information for each user.
* `/requests` - lists of users who have signed up for lunch slots, to be used by the matching algorithm.
* `/slots` - all lunch slots (past, present, and future). Clients should primarily query this by `timestamp`.
* `/topics` - assignments made by the matching algorithm.
