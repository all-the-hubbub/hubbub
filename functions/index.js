const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

class HTTPError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// TODO: Implement the real matching algorithm.
// This version always creates a single 'Firebase' topic and assigns everyone to it.
exports.closeSlot = functions.https.onRequest((req, res) => {
  const slotId = req.body.id;
  if (!slotId) {
    res.sendStatus(400);
    return;
  }

  // Get a few refs for convenience
  const db = admin.database();
  const rootRef = db.ref();
  const slotRef = db.ref(`/slots/${slotId}`);
  const reqsRef = db.ref(`/requests/${slotId}`);

  return slotRef.once('value')
    .then(snapshot => {
      // Does the slot exist?
      const slot = snapshot.val();
      if (!slot) {
        throw new HTTPError(404, 'slot not found');
      }

      // Mark the slot as closed
      return slotRef.update({state: 'closed'});
    })
    .then(() => {
      // Fetch all of the requests
      return reqsRef.once('value');
    })
    .then(snapshot => {
      // Build a multi-key database update
      const updates = {};

      // Create a new topic
      const topicId = 'firebase-001';
      const topic = {
        name: 'Firebase',
        members: {},
      };
      updates[`/topics/${slotId}/${topicId}`] = topic;

      // Add every user to the topic
      const uids = Object.keys(snapshot.val())
      uids.forEach(uid => {
        topic.members[uid] = true;
        updates[`/account/${uid}/slots/${slotId}/topicId`] = topicId;
      });

      // Apply all updates atomically
      return rootRef.update(updates);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      if (err instanceof HTTPError) {
        res.sendStatus(err.code);
      } else {
        res.sendStatus(500);
      }
    });
});
