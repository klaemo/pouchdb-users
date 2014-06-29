/*jshint expr:true */
'use strict';

var Pouch = require('pouchdb');

var usersPlugin = require('../');
Pouch.plugin(usersPlugin);

var chai = require('chai');
chai.use(require("chai-as-promised"));

//
// more variables you might want
//
chai.should(); // var should = chai.should();
require('bluebird'); // var Promise = require('bluebird');

var dbs;
if (process.browser) {
  dbs = 'testdb' + Math.random() +
    ',http://localhost:5984/testdb' + Math.round(Math.random() * 100000);
} else {
  dbs = process.env.TEST_DB;
}

dbs.split(',').forEach(function (db) {
  var dbType = /^http/.test(db) ? 'http' : 'local';
  tests(db, dbType);
});

function tests(dbName, dbType) {

  var db;

  beforeEach(function () {
    db = new Pouch(dbName);
    return db;
  });

  afterEach(function () {
    return Pouch.destroy(dbName);
  });

  describe(dbType + ': .createUser()', function () {
    it('should create user', function () {
      return db.createUser('foo', 'bar').then(function (res) {
        res.ok.should.equal(true);
        res.id.should.equal('org.couchdb.user:foo');
      });
    });
  });

  describe(dbType + ': .login()', function () {
    it('should login user', function () {
      return db.createUser('foo', 'bar').then(function () {
        return db.login('foo', 'bar').then(function (res) {
          res.ok.should.equal(true);
          res.name.should.equal('foo');
        });
      });
    });

    it('should return error for wrong credentials', function () {
      return db.createUser('foo', 'bar').then(function () {
        return db.login('wrong', 'bar').catch(function (err) {
          err.error.should.equal('unauthorized');
        });
      });
    });
  });
}
