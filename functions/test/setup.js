global.assert = require('assert');
global.config = require("../config");
global._ = require("lodash");
global.util = require("util");
let fs = require("fs");

let privateKeyFile = __dirname + "/../hubbub-staging-firebase-adminsdk-np34o-c9ca59c6b6.json";

console.log(privateKeyFile);

if (fs.existsSync(privateKeyFile)) {
  console.log("private key found");
  // Set up connection to staging database. We are using this for tests for now.
  // Later on, we may use test doubles instead.
  let admin = require("firebase-admin");
  const serviceAccount = require(privateKeyFile);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.GCP_PROJECT}.firebaseio.com`
  });
  const db = admin.database();

  config.admin = admin;
  config.db = db;
  config.isTestDatabase = true;
} else {
  console.log("private key not found");
  config.isTestDatabase = false;
}

config.hasOAuthToken = false
if (process.env.GITHUB_OAUTH_TOKEN) {
  config.hasOAuthToken = true;
}
