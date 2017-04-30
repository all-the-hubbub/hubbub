const functions = require('firebase-functions');
const slots = require('./slots');

// allow access from anywhere, since all functions will require authentication
const cors = require('cors')({origin: true});

exports.joinSlot = functions.https.onRequest(slots.join);
exports.leaveSlot = functions.https.onRequest(slots.leave);
exports.closeSlot = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      slots.close(req, res);
    });
});

