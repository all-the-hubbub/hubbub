// allow access from anywhere, since all functions will require authentication
const cors = require('cors')({origin: true});
const express = require('express');
const functions = require('firebase-functions');

// Can only initialize firebase once, so doing here and passing where needed
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const middleware = require('./middleware')(admin);
const oauth = require('./oauth');
const profile = require('./profile');
const slots = require('./slots')(admin);

function makeHttpFunction(fn, middlewares) {
  const router = new express.Router();
  middlewares.forEach(m => {
    router.use(m);
  });
  router.all('*', fn);
  return functions.https.onRequest((req, res) => {
    // NOTE: Adding a temporary fix for issue https://github.com/firebase/firebase-functions/issues/27
    req.url = req.path ? req.url : `/${req.url}`;
    return router(req, res);
  });
}

/*
 * Slots Functions
 */
exports.joinEvent = makeHttpFunction(slots.join, [cors, middleware.userAuthRequired]);
exports.leaveEvent = makeHttpFunction(slots.leave, [cors, middleware.userAuthRequired]);
exports.closeEvent = makeHttpFunction(slots.close, [cors, middleware.userAuthRequired, middleware.adminOnly]);

/*
 * Profile Functions
 */
exports.enqueueUpdateProfileLegacy = functions.database.ref("/accounts/{userId}/githubToken")
  .onWrite(event => {
    // Ignore deletes
    if (!event.data.exists()) {
      return;
    }
    return profile.enqueueUpdateLegacy(event.data.ref);
  });

exports.enqueueUpdateProfile = functions.database.ref("/accounts/{userId}/profileNeedsUpdate")
  .onWrite(event => {
    // Ignore non-truthy values (either a delete or setting to false)
    if (!event.data.val()) {
      return;
    }

    const db = admin.database();
    const userId = event.params.userId;
    return profile.enqueueUpdate(db, userId);
  });

exports.updateProfile = functions.database.ref("/updateProfileQueue/{userId}")
  .onWrite(event => {
    // Ignore deletes
    if (!event.data.exists()) {
      return;
    }

    const db = admin.database();
    const userId = event.params.userId;
    return profile.update(db, userId);
  });

exports.updateProfileCron = functions.https.onRequest((req, res) => {
  return profile.cron(admin.database())
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

// HTTPS function for performing the final step in the GitHub OAuth2 flow.
// Called by the mobile clients to exchange an oauth code for a valid access
// token, enabling signup via the GitHub provider in Firebase Authentication.
//
// Requires that GitHub OAuth configuration has been made available through
// the Firebase CLI as follows, substituting your app's values for <client_id>
// and <client_secret>:
//     firebase functions:config:set github.client_id="<client_id>"
//     firebase functions:config:set github.client_secret="<client_secret>"
//
// Request should be a POST with a JSON body containing the oauth code:
//     {"code": "<oauth_code>"}
//
// JSON Response will contain the new access token:
//     {"access_token": "<oauth_access_token>"}
exports.githubToken = functions.https.onRequest((req, res) => {
  const config = functions.config().github;
  const github = new oauth.GitHub(config.client_id, config.client_secret);
  return github.getToken(req.body.code)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});
