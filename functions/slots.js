const _ = require('lodash');
const errors = require('./errors');
const functions = require('firebase-functions');

module.exports = function(admin) {

function join(req, res) {
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
  const slotRef = db.ref(`/events/${slotId}`);

  return slotRef.once('value')
    .then(snapshot => {
      // Does the slot exist?
      const slot = snapshot.val();
      if (!slot) {
        throw new errors.HTTPError(404, 'slot not found, id: ' + slotId);
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
      updates[`/accounts/${userId}/events/${slotId}`] = slotCopy;

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

function leave (req, res) {
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
  const accountSlotRef = db.ref(`/accounts/${userId}/events/${slotId}`);

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
      updates[`/accounts/${userId}/events/${slotId}`] = null;

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
function close (req, res) {
  const slotId = req.body.id;
  if (!slotId) {
    res.sendStatus(400);
    return;
  }

  // Get a few refs for convenience
  const db = admin.database();
  const rootRef = db.ref();
  const slotRef = db.ref(`/events/${slotId}`);
  const reqsRef = db.ref(`/requests/${slotId}`);

  return slotRef.once('value')
    .then(snapshot => {
      // Does the slot exist?
      const slot = snapshot.val();
      if (!slot) {
        throw new errors.HTTPError(404, 'slot not found, id: ' + slotId);
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

      // Generate topics and assign users to them
      const uids = Object.keys(snapshot.val());
      const topics = generateTopics(3, uids);

      _.forEach(topics, (topic, topicId) => {
        // Add the topic data to each member's account slot
        topic.members.forEach(uid => {
          updates[`/accounts/${uid}/events/${slotId}/topic`] = topic.data;
        });

        // Add the topic assignment (with members)
        const topicWithMembers = _.cloneDeep(topic.data);
        topicWithMembers.members = {};
        topic.members.forEach(uid => {
          topicWithMembers.members[uid] = true;
        });
        updates[`/assignments/${slotId}/${topicId}`] = topicWithMembers;
      });

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

  function generateTopics(groupSize, uids) {
    const names = _.shuffle([
      'JavaScript',
      'Java',
      'Ruby',
      'PHP',
      'Python',
      'Swift',
      'TypeScript',
      'Objective-C',
      'Go',
    ]);

    // Form groups. The last group may be smaller than requested.
    let groups = _.chunk(uids, groupSize);

    // Don't create groups of 1, unless there's only 1 person
    if (groups.length > 1 && _.last(groups).length == 1) {
      let soloUser = _.last(groups)[0];
      groups = _.dropRight(groups, 1);
      _.last(groups).push(soloUser);
    }

    let topics = {};
    groups.forEach((group, i) => {
      let name = names[i % names.length];
      let id = name.toLowerCase().replace(' ', '-') + '-' + i;

      topics[id] = {
        data: {
          id: id,
          name: name,
        },
        members: group,
      };
    });

    return topics;
  }

  return {
    join: join,
    leave: leave,
    close: close,
    generateTopics: generateTopics,
  }
}

