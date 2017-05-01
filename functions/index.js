const functions = require('firebase-functions');
const slots = require('./slots');

// allow access from anywhere, since all functions will require authentication
const cors = require('cors')({origin: true});

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

// TODO: Temporary until a more formal, tested implementation is written
const GitHubbub = require('./githubbub');
exports.updateProfile = functions.database.ref("/accounts/{userId}/githubToken")
  .onWrite(event => {
    const token = event.data.val();
    if (!token) {
      console.log('Token is missing');
      return;
    }

    const github = new GitHubbub(token);
    const userId = event.params.userId;
    const profileRef = event.data.ref.root.child(`/profiles/${userId}`);

    return github.profile()
      .then(data => {
        return profileRef.update({
          uid: userId,
          name: data.name,
          handle: data.login,
          photo: data.avatar_url,
        });
      });
  });
