const datastore = require('@google-cloud/datastore')();
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.buildProfile = functions.https.onRequest((req, res) => {
  const uid = req.query.uid;
  if (!uid) {
    res.sendStatus(400);
    return;
  }

  return admin.database().ref('/account/' + uid).once('value')
    .then(snapshot => {
      const account = snapshot.val();
      if (!account || !account.token) {
        res.sendStatus(401);
        return;
      }

      // Talk to Github, do stuff...

      // Save stuff to Datastore
      const key = datastore.key(['User', uid]);
      const user = {
        key: key,
        data: {
          email: account.email,
        },
      };
      return datastore.save(user);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});
