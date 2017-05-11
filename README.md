# Hubbub
Ever go to a conference and feel like you haven't connected to the people you would have liked to meet? This app seeks to solve that! Using your public Github data, we might be able to connect you with other people who share your technical interests. Maybe not, but at least you'll have lunch with somebody.

This app doesn't do much yet, but it will!

# Development
[![Build Status](https://travis-ci.org/all-the-hubbub/hubbub.svg?branch=master)](https://travis-ci.org/all-the-hubbub/hubbub)

Web and Cloud Functions are in this repo. When code is checked into master branch, tests are run on Travis CI and if they pass, then the code is deployed.

* Production website: https://hubbub-159904.firebaseapp.com/
* Staging website: https://hubbub-staging.firebaseapp.com/

## More details about the app
You authenticate with Github, which triggers a [Cloud Function](https://cloud.google.com/functions/docs/) that grabs a lot of data from the [Github API](https://developer.github.com/v3/).  The initial data fills out your basic profile (e.g. [languages you code in](https://developer.github.com/v3/repos/#list-languages)) and creates a list of connections based on your pull request history or the other committers on projects that you have contributed to.



## Dev Setup

We've got our node app in `functions`, our web app in `webapp/`, and our ios app in `ios/`. Please navigate to their readme files for setup instructions.

install
* [yarn](https://yarnpkg.com) -- required for yarn.lock sanity
* [nvm](https://github.com/creationix/nvm) -- recommended

```
nvm use v6.9.1
ng set --global packageManager=yarn
cd webapp
yarn
```

Deploy webapp
```
cd webapp
npm run deploy
```
### Functions

Set up the [Cloud Datastore Emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator)
so you can run tests that require Cloud Datastore locally.

### Testing Functions

In the `functions` directory, type `yarn test` to run the tests. Fyi, we are using
[yakbak](https://github.com/flickr/yakbak) to record network traffic. We use a config
file to to switch between calling github and the yakbak proxy.

Our tests that call out to the Github API require and OAuth token. You can get a token by logging into the production application and looking at the firebase real-time database console under `accounts`. You can use the test user `hubbubducky` for this purpose (which is what we use on CI). Define and environment variable `GITHUB_OAUTH_TOKEN` to store the token for tests.

To run tests with the debugger, use `yarn test-debug`.

Note: We do not store the api recordings because they contain the token. TODO: After test run, modify the files to remove the token (it seems like they are overused and comments so this shouldn't have an effect).

## CI

We are using [Travis CI](https://travis-ci.org/all-the-hubbub/hubbub) for continuous integration.

Note: The configuration on Travis includes

* `GITHUB_OAUTH_TOKEN`: hubbubducky's OAuth token
* Firebase project auth tokens:
  * `FIREBASE_TOKEN`: `firebase use production; firebase login:ci`
  * `FIREBASE_STAGING_TOKEN`: `firebase use staging; firebase login:ci`

these might need to be updated from time to time.

## Firebase project set up

We have aliases set up to switch environments; however, the master branch is protected on github and deploys should only happen from CI.

```
$ firebase use production
Now using alias production (hubbub-159904)
$ firebase use staging
Now using alias staging (hubbub-staging)
```

