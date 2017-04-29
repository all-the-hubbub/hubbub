const Promise = require('bluebird');
const GitHubApi = require('github');
const url = require('url');
const _ = require("lodash");
const config = require("./config");

function publicRepoFilter(repo) {
  return repo.private === false;
}

class GitHubbub {
  constructor(oauthToken) {
    if (!oauthToken) {
      throw new Error("oauthToken is required");
    }
    let target = url.parse(config.gitHubUrl);
    let gh = {
      protocol: target.protocol.slice(0, -1),
      host: target.hostname,
      port: target.port
    }

    this.client = new GitHubApi( gh );
    this.client.authenticate({
      type: 'oauth',
      token: oauthToken,
    });
  }

  profile () {
    return this.client.users.get({}).then(response => {
      return response.data;
    });
  }

// TODO: Get all commits using pagination. Possibly also using date ranges
// if there are limits on pagination. Note "incomplete_results (bool)" field.
// Ascending order would be more deteriminstic but if there are limits risks missing
// recent info.
  commitsRaw(username, page = 1) {
    let options = {
        q: `author:${username} is:${config.visibility}`,
        sort: 'author-date',
        page: page,
        per_page: 100
    }
    return this.client.search.commits(options)
  }

  commits(username, page = 1) {
    return this.commitsRaw(username, page).then(results => {
      return results.data.items
    });
  }

  // Find all repositories that the current user has made at least one commit to.
  // Returns an array of GitHub.Repository objects.
  reposContributedTo(username, visibility='public') {
    return Promise.props({
      profile: this.client.users.get({}),
      repos: this.client.search.commits({
        q: `author:${username}`,
        is: visibility,
        sort: 'author-date',
        per_page: 100,
      }),
    }).then(results => {
      let commits = results.repos.data.items;
      let repos = commits.map((commit) => {
        return commit.repository
      });
      return _.uniqBy(repos, repo => { repo.id });
    });
  }

  reposStarred(publicOnly=true) {
    return this.client.activity.getStarredRepos({sort: 'updated', per_page: 100})
      .then(got => {
        return publicOnly ? got.data.filter(publicRepoFilter) : got.data;
      });
  }

  reposWatching(publicOnly=true) {
    return this.client.activity.getWatchedRepos({sort: 'updated', per_page: 100})
      .then(got => {
        return publicOnly ? got.data.filter(publicRepoFilter) : got.data;
      });
  }
}


module.exports = GitHubbub;
