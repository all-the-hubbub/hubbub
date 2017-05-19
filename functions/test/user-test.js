const User = require("../user");

const {createOfflineDb, unstubFirebase} = require('./create-mock-db');

describe("User", () => {
  let DB_DATA = {
    accounts: {
      hubbubducky: {
        email: '<email>',
        githubToken: '<token>',
        updatedAt: '<updatedAt>',
        githubCreatedAt: '<githubCreatedAt>',
      }
    },
    profiles: {
      hubbubducky: {
        name: '<name>',
        handle: '<handle>',
        photo: '<photo>',
      }
    }
  };

  let db;

  beforeEach(() => {
    db = createOfflineDb(DB_DATA);
  });

  describe("static", () => {
    describe(".findById", () => {

      describe("when passed user id that exists in firebase", () => {

        let user;

        beforeEach(() => {
          return User.findById(db, "hubbubducky").then(u => user = u);
        });

        it("loads /accounts/:id/* information", () => {
          assert.equal(user.email, "<email>");
          assert.equal(user.githubToken, "<token>");
          assert.equal(user.updatedAt, "<updatedAt>");
          assert.equal(user.githubCreatedAt, "<githubCreatedAt>");
        });

        it("loads /profiles/:id/* information", () => {
          assert.equal(user.name, "<name>");
          assert.equal(user.handle, "<handle>");
          assert.equal(user.photo, "<photo>");
        });
      });

      describe("when passed an unknown user id", () => {
        it("rejects", () => {
          User.findById(db, "hubbubcorgi")
            .then(() => assert.ok(false, 'should reject'))
            .catch(() => assert.ok(true, 'should reject'));
        });
      });
    });  // .findById
  });  // static

  describe("when there is a user", () => {

    const id = "hubbubducky";

    beforeEach(() => {
      return User.findById(db, id).then(u => user = u);
    });

    describe(".updateProfile", () => {
      describe("when user can get information from github", () => {
        const githubProfile = {
          "login": "hubbubducky",
          "avatar_url": "https://avatars2.githubusercontent.com/u/26857894?v=3",
          "name": "Hubbub Ducky",
          "created_at": "2017-04-02T19:14:57Z"
        }

        const fakeGitHubbub = {
          profile() {
            return Promise.resolve(githubProfile);
          }
        };

        beforeEach(() => {
          user.github = fakeGitHubbub;
        });

        it("updates the user's profile locally", () => {
          return user.updateProfile()
            .then(profile => {
              assert.equal(profile.handle, "hubbubducky", "incorrect handle");
              assert.equal(profile.name, "Hubbub Ducky", "incorrect name");
              assert.equal(profile.photo,
                "https://avatars2.githubusercontent.com/u/26857894?v=3",
                "incorrect photo");
            });
        });

        it("updates the user's profile in the db", () => {
          return user.updateProfile()
            .then(() => db.ref(`/profiles/${id}`).once('value'))
            .then(snap => {
              const db = snap.val();
              assert.equal(db.handle, "hubbubducky");
              assert.equal(db.name, "Hubbub Ducky");
              assert.equal(db.photo,
                "https://avatars2.githubusercontent.com/u/26857894?v=3");
            });
        });
      });
    })  // .updateProfile
  });  // when there is a user
});  // User
