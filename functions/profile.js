const Promise = require('bluebird');
const User = require('./user');

function nowEpochSeconds() {
  return Math.floor(Date.now() / 1000);
}

// For legacy clients that only write githubToken (not profileNeedsUpdate)
function enqueueUpdateLegacy(githubTokenRef) {
  return githubTokenRef.parent.child('profileNeedsUpdate').set(true);
}

function enqueueUpdate(db, uid) {
  const now = nowEpochSeconds();
  const queueRef = db.ref(`/updateProfileQueue/${uid}`);
  return queueRef.set({
    createdAt: now,
    updatedAt: now,
  });
}

function update(db, uid) {
  return User.findById(db, uid)
    .then(user => {
      // Fetch and save new profile data from GitHub
      return user.updateProfile();
    })
    .then(() => {
      // Atomically delete the queue entry and clear profileNeedsUpdate flag
      const updates = {}
      updates[`/updateProfileQueue/${uid}`] = null;
      updates[`/accounts/${uid}/profileNeedsUpdate`] = false;

      const rootRef = db.ref();
      return rootRef.update(updates);
    });
}

function cron(db) {
  function fixEnqueueUpdateLegacyFails() {
    // Find all accounts that DONT have a profileNeedsUpdate field, then set it
    return db.ref('accounts').orderByChild('profileNeedsUpdate').equalTo(null).once('value')
      .then(accountSnapshots => {
        var promises = [];
        accountSnapshots.forEach(accountSnapshot => {
          const uid = accountSnapshot.key;
          const needsUpdate = (accountSnapshot.val().githubToken !== undefined);
          promises.push(db.ref(`/accounts/${uid}/profileNeedsUpdate`).set(needsUpdate));
        });
        return Promise.all(promises);
      });
  }

  function fixEnqueueUpdateFails() {
    // Fetch the current state of the queue so we can avoid re-enqueueing users
    let alreadyEnqueued = {};
    return db.ref('updateProfileQueue').once('value')
      .then(queueEntrySnapshots => {
        queueEntrySnapshots.forEach(entrySnapshot => {
          const uid = entrySnapshot.key;
          alreadyEnqueued[uid] = true;
        });

        // Find all users who are still waiting for a profile update
        return db.ref('accounts').orderByChild('profileNeedsUpdate').equalTo(true).once('value')
      })
      .then(accountSnapshots => {
        // Enqueue users who aren't already in the queue
        var promises = [];
        accountSnapshots.forEach(accountSnapshot => {
          const uid = accountSnapshot.key;
          if (!alreadyEnqueued[uid]) {
            promises.push(enqueueUpdate(db, uid));
          }
        });
        return Promise.all(promises);
      });
  }

  function fixUpdateFails() {
    // Consider a queue entry to be stale if it has not been modified in >= staleSeconds
    const now = nowEpochSeconds();
    const staleSeconds = 60*2;
    const staleTime = now - staleSeconds;

    // Find all stale queue entries
    return db.ref('updateProfileQueue').orderByChild('updatedAt').endAt(staleTime).once('value')
      .then(queueEntrySnapshots => {
        // Modify the entry (by writing an updatedAt timestamp) to force it to restart
        var promises = [];
        queueEntrySnapshots.forEach(entrySnapshot => {
          const uid = entrySnapshot.key;
          promises.push(db.ref(`/updateProfileQueue/${uid}/updatedAt`).set(now));
        });

        return Promise.all(promises);
      });
  }

  return fixEnqueueUpdateLegacyFails()
    .then(fixEnqueueUpdateFails)
    .then(fixUpdateFails);
}

module.exports = {
  enqueueUpdateLegacy: enqueueUpdateLegacy,
  enqueueUpdate: enqueueUpdate,
  update: update,
  cron: cron,
};
