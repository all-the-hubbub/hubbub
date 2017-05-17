# Hubbub
Ever go to a conference and feel like you haven't connected to the people you would have liked to meet? This app seeks to solve that! Using your public GitHub data, we might be able to connect you with other people who share your technical interests. Maybe not, but at least you'll have lunch with somebody.

This app doesn't do much yet, but it will!

# Development
[![Build Status](https://travis-ci.org/all-the-hubbub/hubbub.svg?branch=staging)](https://travis-ci.org/all-the-hubbub/hubbub)

Join us in the [dev mailing list](https://groups.google.com/d/forum/hubbub-code) to ask questions about the code or if you'd like to contribute!

Web and Cloud Functions are in this repo. When code is checked into master branch, tests are run on Travis CI and if they pass, then the code is deployed.

* Production website: https://hubbub-159904.firebaseapp.com/
* Staging website: https://hubbub-staging.firebaseapp.com/

## More details about the app
You authenticate with GitHub, which triggers a [Cloud Function](https://cloud.google.com/functions/docs/) that grabs a lot of data from the [GitHub API](https://developer.github.com/v3/).  The initial data fills out your basic profile (e.g. [languages you code in](https://developer.github.com/v3/repos/#list-languages)) and creates a list of connections based on your pull request history or the other committers on projects that you have contributed to.

## Setting up a dev environment

### Install dev tools

Note: we're using yarn to manage npm dependencies, which is really helpful
for making sure you are using the exact same set of modules that have been
tested to work with this project. The following instructions specify some
global installs and config, which shouldn't be required if you know what you
are doing, but make it much easier to get started if you are new to some of
this tech, and even for many of us who use it all the time!

These instructions use `yarn` and `nvm` which we recommend:
* [yarn](https://yarnpkg.com) -- required for yarn.lock sanity
* [nvm](https://github.com/creationix/nvm) -- makes easier switching to and from
  other node projects that you might have

```
nvm use v6.9.1
npm install -g firebase-tools
npm install -g @angular/cli
ng set --global packageManager=yarn
git clone https://github.com/all-the-hubbub/hubbub.git
cd hubbub
```

### Set up project

To run a dev instance of Hubbub, you will need your own firebase project to
run the Cloud Functions.  Since we are calling an external service from a Cloud
Function, we need to set up billing for the account.

1. Go to the [Firebase console](https://console.firebase.google.com) and
   create a new project called `hubbub-dev`
2. Setup billing. The easiset way is to upgrade to the pay-as-you-go Blaze plan,
   but you won't be charged unless your usage exceeds the [generous free tier](https://firebase.google.com/pricing/).
2. Click "Add Firebase to your web app" and copy the projectId, which should
   look something like `hubbub-dev-1234`
3. in your hubbub directory (which you should be in if you followed the steps
   above), type the following command using YOUR project id:
   `firebase use hubbub-dev-1234`
4. then run the following command to configure the web app with your project
   info: `./setup.sh`
5. Now we need to set up OAuth for GitHub!
   1. In Firebase Console, go to  Authentication (via left nav)
   2. Choose "SIGN-IN METHOD" tab (along the top of the panel) ![Firebase Console shows lists of authentication providers][fb-auth]
   3. Select 'Github' and then turn on 'Enable' in the top right
   4. In another browser tab, go to your settings for OAuth applications, which for an individual account is: https://github.com/settings/applications/new (the
   URL would be different if you want to create the OAuth app for a GitHub
   organization)
   5. Fill in info about your project (OAuth callback URL can be found in
      Firebase Auth console).  Here's an example: ![Github app registration form][github-register-app]
   6. Submit the form and then GitHub will show you a page with your Client ID
      and Client Secret.
   7. Go back to the Firebase Console and fill that in and click "Save"
5. then install node modules for web app and functions, build the web app,
and deploy everything!

```
cd webapp
yarn            # install the node modules
npm run test    # all of the webapp tests should pass
```

By default the tests "watch" files, and will rerun the tests any time
you change the code.  Once you see the results, you can interrupt this
with Ctrl-C.

Now we'll build and deploy the site and functions...

```
npm run build   # this builds the static artifacts for web app
cd ..
(cd functions; yarn)
# skipping functions testing for now since our tests need a Github token
firebase deploy
```

Note: we need to deploy the app before we can run locally so the OAuth callback will be present at the place Github expects it to be

To view the app, go to /login, the homepage is currently blank

## Development details
We've got our node app in `functions`, our web app in `webapp/`

Testing webapp
```
cd webapp
npm run test
```

Run the webapp
```
npm run start
```

Deploy webapp only
```
cd webapp
npm run deploy
```

### TODO: Server data

The Admin Web UI isn't finished, so for the app to work end-to-end we need to
seed the database with events (which would be nice for open source developers
and interactive testing anyhow)

### Functions

Testing Cloud Functions
```
cd functions
npm run test
```

TODO: Currently the Cloud Functions tests need a bit more work to be
open-source-friendly -- we need to make it so the tests will work without
everyone knowing the GitHub token for `hubbubducky`!

Some of the tests use the [Cloud Datastore Emulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator)
to run tests that require Cloud Datastore locally.

[fb-auth]: doc/dev/firebase-auth-github-config-0.png "Firebase Auth Sign-in Method"
[github-oauth-apps]: doc/dev/firebase-auth-github-config-1.png "Github OAuth Applications Settings"
[github-register-app]: doc/dev/firebase-auth-github-config-2.png "Github OAuth App Registration"
