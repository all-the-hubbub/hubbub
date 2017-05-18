const request = require('request-promise');

class GitHub {
  constructor(clientId, clientSecret, opts) {
    if (!clientId || !clientSecret) {
      throw new Error('Missing required clientId/Secret');
    }
    opts = opts || {};

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.endpoint = 'https://github.com' || opts.endpoint;
  }

  getToken(code) {
    const opts = {
      method: 'POST',
      uri: `${this.endpoint}/login/oauth/access_token`,
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
      },
      json: true,
    };
    return request(opts);
  }
}

module.exports = {
  GitHub: GitHub,
};
