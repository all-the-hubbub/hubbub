const functions = require('firebase-functions');
const slots = require('./slots');

exports.joinSlot = functions.https.onRequest(slots.join);
exports.leaveSlot = functions.https.onRequest(slots.leave);
exports.closeSlot = functions.https.onRequest(slots.close);
