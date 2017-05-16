const _ = require('lodash');
const nock = require('nock');
const uuid = require('uuid');

const oauth = require('../oauth');

describe("OAuth", () => {
  describe("GitHub", () => {
    it("constructor requires clientId and clientSecret", () => {
      assert.throws(() => {
        new oauth.GitHub();
      });
    });

    describe("getToken()", () => {
      var clientId;
      var clientSecret;
      var code;
      var accessToken;
      var client;

      beforeEach(() => {
        clientId = uuid.v4();
        clientSecret = uuid.v4();
        code = uuid.v4();
        accessToken = uuid.v4();
        client = new oauth.GitHub(clientId, clientSecret);

        nock('https://github.com')
          .post('/login/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
          })
          .reply(200, {
            access_token: accessToken,
          });
      });

      afterEach(() => {
        nock.cleanAll();
      });

      it("sends expected POST parameters", (done) => {
        client.getToken(code)
          .then(data => {
            done();
          })
          .catch(done);
      });

      it("parses and returns JSON response", (done) => {
        client.getToken(code)
          .then(data => {
            assert.ok(data);
            assert.equal(data.access_token, accessToken);
            done();
          })
          .catch(done);
      });
    });
  });
});
