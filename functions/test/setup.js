global.assert = require('assert');
global.config = require("../config");
global._ = require("lodash");
global.util = require("util");

before(() => {
  console.log('before all tests');
});

after(() => {
  console.log("after all tests");
});
