# hubbub.live

The live app and ci use specific projects that are only accessible by the core team.

## Firebase project set up

We have aliases set up to switch environments; however, the master branch is protected on github and deploys should only happen from CI.

```
$ firebase use production
Now using alias production (hubbub-159904)
$ firebase use staging
Now using alias staging (hubbub-staging)
```

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

