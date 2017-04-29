# Hubbub
Ever go to a conference and feel like you haven't connected to the people you would have liked to meet? This app seeks to solve that! Using your public Github data, we might be able to connect you with other people who share your technical interests. Maybe not, but at least you'll have lunch with somebody.

This app doesn't do much yet, but it will!

## App Concept
You authenticate with Github, which triggers a [Cloud Function](https://cloud.google.com/functions/docs/) that grabs a lot of data from the [Github API](https://developer.github.com/v3/).  The initial data fills out your basic profile (e.g. [languages you code in](https://developer.github.com/v3/repos/#list-languages)) and creates a list of connections based on your pull request history or the other committers on projects that you have contributed to.


## Dev Setup
We've got our node app in `webapp/` and our ios app in `ios/`. Please navigate to their readme files for setup instructions.
