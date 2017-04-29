const GitHubbub = require('../githubbub');
var yakbak = require('yakbak');
var http = require('http');

var proxy = http.createServer(yakbak('https://api.github.com', {
  dirname: `${__dirname}/fixtures/githubbub`
}));

describe('GitHubbub', function() {
  before(function (done) {
    proxy.listen(4567, done);
    config.gitHubUrl = "http://localhost:4567";
  });
  // Increase individual test time out to 10s
  this.timeout(10000);

  describe("when we have an oauth token", function () {
    // This is the oauth token (for user hubbubducky) used for recording. when
    // re-recording, this may need to be updated.
    let oauthToken, client, repos;

    beforeEach(function () {
      oauthToken = process.env.GITHUB_OAUTH_TOKEN;
      if (!oauthToken) {
        throw new Error("No GITHUB_OAUTH_TOKEN environment variable found; needed for github api")
      }

      client = new GitHubbub(oauthToken);
      repositories = [];
    });

    describe(".profile", () => {
      it("returns the profile", () => {
        return client.profile().then(profile => {
          assert.equal(profile.login, "hubbubducky");
        });
      });
    });

    describe(".commits", () => {
      it("searches for commits", (done) => {
         client.commits("hubbubducky").then(commits => {
          _.each(commits, commit => {
            let info = {
              sha: commit.sha,
              url: commit.url,
              date: commit.commit.author.date,
              repositoryId: commit.repository.id,
              repositoryUrl: commit.repository.url,
              repositoryIsAFork: commit.repository.fork,
              repositoryName: commit.repository.full_name
            };
            // console.log("info", info);
            // if(info.repositoryIsAFork) {
            //   debugger;
            // }
          });
          done()
        });
      });
    });

    describe('.reposContributedTo', function() {
      it('fetches repositories that the current user has committed to', function(done) {
        client.reposContributedTo("hubbubducky")
          .then(repos => {
            let repoNames = _.map(repos, repo => {
              return repo.full_name;
            });
            assert.deepEqual(repoNames, [
              "all-the-hubbub/test"
            ]);
            done();
          })
          .catch(done);
      });
    });

    describe('.reposStarred', function() {
      it('fetches repositories that the current user has starred', function(done) {
        client.reposStarred()
          .then(repos => {
            repos.forEach(repo => {
              repositories.push(repo.full_name);
            });

            assert.deepEqual(repositories, [
              "all-the-hubbub/test"
            ])
            done();
          })
          .catch(done);
      });
    });

    describe('.reposWatching', function() {
      it('fetches repositories that the current user is watching', function(done) {
        client.reposWatching()
          .then(repos => {
            repos.forEach(repo => {
              repositories.push(repo.full_name);
            });

            assert.deepEqual(repositories, [
              "all-the-hubbub/test"
            ])
            done();
          })
          .catch(done);
      });
    });
  });
});
