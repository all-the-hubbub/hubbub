const cloneDeep = require('lodash.clonedeep');
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.join = function(req, res) {
  // TODO: replace with auth middleware
  const userId = req.body.userId;
  if (!userId) {
    res.sendStatus(401);
    return;
  }

  const slotId = req.body.id;
  if (!slotId) {
    res.sendStatus(400);
    return;
  }

  // Get a few refs for convenience
  const db = admin.database();
  const rootRef = db.ref();
  const slotRef = db.ref(`/slots/${slotId}`);

  return slotRef.once('value')
    .then(snapshot => {
      // Does the slot exist?
      const slot = snapshot.val();
      if (!slot) {
        throw new HTTPError(404, 'slot not found');
      }

      // Only grant the request if the slot is open
      if (slot.state !== 'open') {
        throw new HTTPError(400, 'slot is ' + slot.state);
      }

      // Build a multi-key database update
      const updates = {};

      // Create a new request
      updates[`/requests/${slotId}/${userId}`] = true;

      // Copy the slot data into the user's slots
      const slotCopy = cloneDeep(slot);
      delete slotCopy.state;
      update[`/account/${userId}/slots/${slotId}`] = slotCopy;

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
};
