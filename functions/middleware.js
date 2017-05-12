module.exports = function(admin) {

  // Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
  // The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
  // `Authorization: Bearer <Firebase ID Token>`.
  // when decoded successfully, the ID Token content will be added as `req.user`.
  function userAuthRequired(req, res, next) {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>');
      res.status(403).send('Unauthorized');
      return;
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
      req.user = decodedIdToken;
      next();
    }).catch(error => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });
  };

  function adminOnly(req, res, next) {
    if (!req.user) {
      res.sendStatus(403);
      return;
    }

    admin.database().ref(`/accounts/${req.user.uid}/admin`).once('value')
      .then(snapshot => {
        let isAdmin = (snapshot.val() === true);
        if (isAdmin) {
          next();
        } else {
          console.log(`Attempt to access admin endpoint rejected for uid=${req.user.uid}`);
          res.sendStatus(403);
        }
      })
      .catch(err => {
        console.error('Error checking for admin status:', err)
        res.sendStatus(500);
      });
  };

  return {
    userAuthRequired: userAuthRequired,
    adminOnly: adminOnly,
  };

};
