const _ = require('lodash');
const errors = require('./errors');
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
        throw new errors.HTTPError(404, 'slot not found');
      }

      // Only grant the request if the slot is open
      if (slot.state !== 'open') {
        throw new errors.HTTPError(400, 'slot is ' + slot.state);
      }

      // Build a multi-key database update
      const updates = {};

      // Create a new request
      updates[`/requests/${slotId}/${userId}`] = true;

      // Copy the slot data into the user's slots
      const slotCopy = _.cloneDeep(slot);
      delete slotCopy.state;
      updates[`/account/${userId}/slots/${slotId}`] = slotCopy;

      // Apply all updates atomically
      return rootRef.update(updates);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      if (err instanceof errors.HTTPError) {
        res.sendStatus(err.code);
      } else {
        res.sendStatus(500);
      }
    });
};

exports.leave = function(req, res) {
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
  const accountSlotRef = db.ref(`/account/${userId}/slots/${slotId}`);

  return accountSlotRef.once('value')
    .then(snapshot => {
      // If the user hasn't joined the slot, there's nothing to do
      const accountSlot = snapshot.val();
      if (!accountSlot) {
        return;
      }

      // TODO: Allow leaving a slot after you've been assigned a topic?
      if (accountSlot.topic) {
        throw new errors.HTTPError(400, 'topic already assigned');
      }

      // Build a multi-key database update
      const updates = {};

      // Delete existing request
      updates[`/requests/${slotId}/${userId}`] = null;

      // Delete the account slot
      updates[`/account/${userId}/slots/${slotId}`] = null;

      // Apply all updates atomically
      return rootRef.update(updates);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      if (err instanceof errors.HTTPError) {
        res.sendStatus(err.code);
      } else {
        res.sendStatus(500);
      }
    });
};

// TODO: Implement the real matching algorithm.
// This version always creates a single 'Firebase' topic and assigns everyone to it.
exports.close = function(req, res) {
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
        throw new errors.HTTPError(404, 'slot not found');
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
      const topic = {
        id: 'firebase-001',
        name: 'Firebase',
      };

      // Add the topic to each member's account slot
      const uids = Object.keys(snapshot.val())
      uids.forEach(uid => {
        updates[`/account/${uid}/slots/${slotId}/topic`] = topic;
      });

      // Add the topic members
      const topicWithMembers = _.cloneDeep(topic);
      topicWithMembers.members = {};
      uids.forEach(uid => {
        topicWithMembers.members[uid] = true;
      });
      updates[`/topics/${slotId}/${topic.id}`] = topicWithMembers;

      // Apply all updates atomically
      return rootRef.update(updates);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      if (err instanceof errors.HTTPError) {
        res.sendStatus(err.code);
      } else {
        res.sendStatus(500);
      }
    });
};
