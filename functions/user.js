const _ = require("lodash");
const GitHubbub = require('./githubbub');
const Promise = require('bluebird');
const ServerValue = require('firebase-admin').database.ServerValue;

class User {
  static findById(db, id) {
    return Promise.props({
      account: db.ref(`/accounts/${id}`).once("value").then(snapshot => {
        return snapshot.val();
      }),
      profile: db.ref(`/profiles/${id}`).once("value").then(snapshot => {
        return snapshot.val();
      })
    }).then(data => {
      let
        account = data.account || {}
      , profile = data.profile || {};

      return new User(db, {
        id: id,
        email: account.email,
        githubToken: account.githubToken,
        updatedAt: account.updatedAt,
        githubCreatedAt: account.githubCreatedAt,
        name: profile.name,
        handle: profile.handle,
        photo: profile.photo
      });
    });
  }

  constructor(db, attributes) {
    this.db = db;

    this.id = attributes.id;
    this.email = attributes.email;
    this.githubToken = attributes.githubToken;
    this.updatedAt = attributes.updatedAt;
    this.githubCreatedAt = attributes.githubCreatedAt;
    this.name = attributes.name;
    this.handle = attributes.handle;
    this.photo = attributes.photo;
    this.uid = attributes.uid;
    this.github = new GitHubbub(this.githubToken);
  }

  updateProfile () {
    let
      self = this
    , db = this.db
    , accountRef = db.ref(`/accounts/${this.id}`)
    , profileRef = db.ref(`/profiles/${this.id}`);
    return this.github.profile().then(data => {
      let newProfile = {
        photo: data.avatar_url,
        name: data.name,
        handle: data.login,
      };
      return Promise.all([
        accountRef.update({
          githubCreatedAt: data.created_at,
          updatedAt: ServerValue.TIMESTAMP,
          handle: data.login,     // for debugging via Firebase Console
        }),
        profileRef.update(newProfile)
      ]).then(() => {
        return newProfile;        // for testing
      });
    })
  }
}

module.exports = User;
