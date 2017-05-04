const User = require("../user")(config.admin);

describe("User", function () {
  this.timeout(10000);

  let
    userPromise
  , id = "dmHNBNH2fnNh43c1YgaVA2KUUWA2"; // id of hubbubducky; will need to be updated if this changes

  if (!config.isTestDatabase) {
    console.log("Test requires database; skipping on CI.");
  } else {
    describe("static", () => {
      describe(".findById", () => {
        describe("when passed user id that exists in firebase", () => {

          beforeEach(() => {
            userPromise = User.findById(id);
          });

          it("user has an oauth token", () => {
            return userPromise.then(user => {
              assert.equal(user.githubToken, process.env.GITHUB_OAUTH_TOKEN);
              assert.equal(user.email, "hubbubducky@gmail.com");
            });
          });
        });
      });
    });

    describe("when there is a user", () => {
      beforeEach(() => {
        console.log("id", id);
        userPromise = User.findById(id);
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
            }).then(data => {
              assert.equal(data, "hubbubducky");
              assert.equal(user.name, "Hubbub Ducky");
              assert.equal(user.photo, "https://avatars2.githubusercontent.com/u/26857894?v=3");
              assert.equal(user.id, id);
            });
          });
        });
      })
    });
  }
});
