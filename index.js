'use strict';

var utils = require('./pouch-utils');
var pbkdf2 = require('crypto-js/pbkdf2');
var WordArray = require('crypto-js/lib-typedarrays');

var KEY_SIZE = 128 / 32;

exports.createUser = utils.toPromise(function (name, pass, cb) {
  // var pouch = this;
  // var PouchDB = pouch.constructor;
  var doc = createUserDoc(name, pass);
  
  this.put(doc, function (err, res) {
    if (err) {
      return cb(err);
    }
    cb(null, res);
  });
});

exports.login = utils.toPromise(function (name, pass, cb) {
  var id = 'org.couchdb.user:' + name;
  var authError = {
    error: 'unauthorized',
    reason: 'Name or password is incorrect.'
  };

  this.get(id, function (err, userDoc) {
    if (err && err.status === 404) {
      return cb(authError);
    }
    if (err) {
      return cb(err);
    }

    var key = pbkdf2(pass, userDoc.salt, { iterations: 10, keySize: KEY_SIZE });

    if (key.toString() !== userDoc.derived_key) {
      return cb(authError);
    }

    cb(null, { ok: true, name: userDoc.name, roles: userDoc.roles });
  });
});

exports._createUserDoc = createUserDoc;

function createUserDoc(name, pass) {
  var salt = WordArray.random(128 / 8).toString();
  var key = pbkdf2(pass, salt, { iterations: 10, keySize: KEY_SIZE });

  return {
    '_id': 'org.couchdb.user:' + name,
    'password_scheme': 'pbkdf2',
    'iterations': 10,
    'name': name,
    'roles': [],
    'type': 'user',
    'derived_key': key.toString(),
    'salt': salt
  };
}

/* istanbul ignore next */
if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(exports);
}
