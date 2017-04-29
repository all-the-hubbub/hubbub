const functions = require('firebase-functions');
const slots = require('./slots');

exports.requestSlot = functions.https.onRequest(slots.join);
exports.closeSlot = functions.https.onRequest(slots.close);
