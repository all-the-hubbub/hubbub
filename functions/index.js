const functions = require('firebase-functions');
// Can only initialize firebase once, so doing here and passing where needed
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const express = require('express');
// allow access from anywhere, since all functions will require authentication
const cors = require('cors')({origin: true});
const middleware = require('./middleware')(admin);

const slots = require('./slots')(admin);
const User = require("./user");

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

exports.joinEvent = makeHttpFunction(slots.join, [cors, middleware.userAuthRequired]);
exports.leaveEvent = makeHttpFunction(slots.leave, [cors, middleware.userAuthRequired]);
exports.closeEvent = makeHttpFunction(slots.close, [cors, middleware.userAuthRequired, middleware.adminOnly]);

exports.updateProfile = functions.database.ref("/accounts/{userId}/githubToken")
  .onWrite(event => {
    const db = admin.database();
    return User.findById(db, event.params.userId).then( (user) => {
      return user.updateProfile();
    });
  });
