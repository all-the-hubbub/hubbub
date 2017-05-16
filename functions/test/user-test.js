const User = require("../user");

describe("User", function () {
  this.timeout(10000);

  let
    userPromise
  , db = config.db
  , id = "S7osJegfQvWPhpSNSWsBwMroUgo2"; // id of hubbubducky; will need to be updated if this changes

  if (!config.isTestDatabase) {
    console.log("database not configured, skipping test");
    // TODO: tests shouldn't need a live database
  } else if (!config.hasOAuthToken) {
    console.log("OAuth token not configured, skipping test");
    // TODO: we should have some unit tests for this that don't require access
  } else {
    describe("static", () => {
      describe(".findById", () => {
        describe("when passed user id that exists in firebase", () => {

          beforeEach(() => {
            userPromise = User.findById(db, id);
          });

          it("user has an oauth token", () => {
            return userPromise.then(user => {
              assert.equal(user.githubToken, process.env.GITHUB_OAUTH_TOKEN);
              assert.equal(user.handle, "hubbubducky");
            });
          });
        });
      });
    });

    describe("when there is a user", () => {
      beforeEach(() => {
        userPromise = User.findById(db, id);
      });

      describe(".updateProfile", function () {
        describe("when user can get information from github", () => {
          let
            githubProfile = {
              "login": "hubbubducky",
              "avatar_url": "https://avatars2.githubusercontent.com/u/26857894?v=3",
              "name": "Hubbub Ducky",
              "created_at": "2017-04-02T19:14:57Z"
            }
          , fakeGitHubbub = {
            profile: () => {
              return new Promise((resolve, reject) => {
                resolve(githubProfile);
              })
            }
          };

          beforeEach(() => {
            userPromise.then(user => {
              user.github = fakeGitHubbub;
              return user;
            });
          });

          it("updates the user's profile", () => {
            return userPromise.then(user => {
              return user.updateProfile();
            }).then(profile => {
              assert.equal(profile.handle, "hubbubducky", "incorrect handle");
              assert.equal(profile.name, "Hubbub Ducky", "incorrect name");
              assert.equal(profile.photo,
                "https://avatars2.githubusercontent.com/u/26857894?v=3",
                "incorrect photo");
            });
          });
        });
      })
    });
  }
});
