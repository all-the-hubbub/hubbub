/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Firebase
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @fileoverview Code taken from https://github.com/firebase/emberfire
 */

const firebase = require('firebase-admin');

/**
 * When a reference is in offline mode it will not call any callbacks
 * until it goes online and resyncs. The ref will have already
 * updated its internal cache with the changed values so we shortcut
 * the process and call the supplied callbacks immediately (asynchronously).
 */
function stubFirebase() {
  // check for existing stubbing
  if (!firebase._unStub) {
    var originalSet = firebase.database.Reference.prototype.set;
    var originalUpdate = firebase.database.Reference.prototype.update;
    var originalRemove = firebase.database.Reference.prototype.remove;

    firebase._unStub = function () {
      firebase.database.Reference.prototype.set = originalSet;
      firebase.database.Reference.prototype.update = originalUpdate;
      firebase.database.Reference.prototype.remove = originalRemove;
    };

    firebase.database.Reference.prototype.set = function(data, cb) {
      originalSet.call(this, data);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

    firebase.database.Reference.prototype.update = function(data, cb) {
      originalUpdate.call(this, data);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };

    firebase.database.Reference.prototype.remove = function(cb) {
      originalRemove.call(this);
      if (typeof cb === 'function') {
        setTimeout(cb, 0);
      }
    };
  }
}

function unstubFirebase() {
  if (typeof firebase._unStub === 'function') {
    firebase._unStub();
    delete firebase._unStub;
  }
}

/**
 * Creates an offline firebase reference with optional initial data and url.
 *
 * Be sure to `stubFirebase()` and `unstubFirebase()` in your tests!
 *
 * @param  {!Object} initialData
 * @param  {string} url
 * @param  {string} appName
 * @return {!firebase.database.Database}
 */
function createOfflineDb(initialData = {},
    url = 'https://hubbub-tests-9123.firebaseio.com',
    appName = 'offline-test') {

  stubFirebase();

  const config = {
    credential: {
      getAccessToken() { return ''; }
    },
    databaseURL: url
  };

  let app;

  try {
    app = firebase.app(appName);
  } catch (e) {
    app = firebase.initializeApp(config, appName);
  }

  const db = app.database();
  db.goOffline(); // must be called after the ref is created
  db.ref().set(initialData);
  return db;
}

module.exports = {
  createOfflineDb,
  stubFirebase,
  unstubFirebase,
};
