const functions = require('firebase-functions');
// Can only initialize firebase once, so doing here and passing where needed
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const slots = require('./slots')(admin);

// allow access from anywhere, since all functions will require authentication
const cors = require('cors')({origin: true});

const User = require("./user")(admin);

exports.joinSlot = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      slots.join(req, res);
    });
});

exports.leaveSlot = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      slots.leave(req, res);
    });
});

exports.closeSlot = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      slots.close(req, res);
    });
});

exports.updateProfile = functions.database.ref("/accounts/{userId}/githubToken")
  .onWrite(event => {
    let start = new Date();
    console.log("updateProfile event ", event, start.toString());
    return User.findById(event.params.userId).then((user) => {
      let diff = (start - new Date())/1000;
      console.log("updateProfile", diff, user);
      return user.updateProfile();
    });
  });
