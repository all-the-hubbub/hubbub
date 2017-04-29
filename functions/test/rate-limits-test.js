const GitHubbub = require('../githubbub');
const assert = require('assert');
let _ = require("lodash");
const Promise = require("bluebird");

// Created this file just to verify that rate limits are per user. Keeping it
// (but skipped) here for future reference.

xdescribe('GitHubbub', function() {
  // Increase individual test time out to 10s
  this.timeout(10000);

  describe("when we have 2 different oauth tokens", () => {
    it("uses separate rate limits", () => {
      let
        client1 = new GitHubbub(process.env.GITHUB_OAUTH_TOKEN),
        client2 = new GitHubbub(process.env.GITHUB_OAUTH_TOKEN_2);

        return Promise.props({
          rateLimit1: client1.client.misc.getRateLimit({}),
          rateLimit2: client2.client.misc.getRateLimit({})
        }).then(rateLimitsBefore => {
          return Promise.props({
            commits1: client1.commits("hubbubducky"),
            commits2: client1.commits("hubbubducky"),
            commits3: client1.commits("hubbubducky"),
            commits4: client1.commits("hubbubducky"),
            commits5: client1.commits("hubbubducky"),
            commits6: client2.commits("hubbubducky"),
            before: rateLimitsBefore
          }).then(results => {
            return Promise.props({
              rateLimit1: client1.client.misc.getRateLimit({}),
              rateLimit2: client2.client.misc.getRateLimit({}),
              rateLimit1Before: results.before.rateLimit1,
              rateLimit2Before: results.before.rateLimit2
            }).then(rateLimits => {
              // console.log("rateLimit1Before", rateLimits.rateLimit1Before.data.resources.search);
              // console.log("rateLimit1", rateLimits.rateLimit1.data.resources.search);
              // console.log("rateLimit2Before", rateLimits.rateLimit2Before.data.resources.search);
              // console.log("rateLimit2", rateLimits.rateLimit2.data.resources.search);
              assert.equal(rateLimits.rateLimit1Before.data.resources.search.remaining - rateLimits.rateLimit1.data.resources.search.remaining, 5);
              assert.equal(rateLimits.rateLimit2Before.data.resources.search.remaining - rateLimits.rateLimit2.data.resources.search.remaining, 1);
            });
          });
        });
    });
  });
});
