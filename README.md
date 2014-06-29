PouchDB Users Plugin
=====

[![Build Status](https://travis-ci.org/klaemo/pouchdb-users.svg)](https://travis-ci.org/klaemo/pouchdb-users)

This plugin aims to provide an implementation of CouchDB's `_users` database
for PouchDB.

Currently there is no session management, so the login method only fetches
the user's document and compares the hashed (pbkdf2) passwords.

This plugin also doesn't enforce authentication or authorization. Even after
you've created some users your PouchDB will still be in "Admin Party".

Installation
--------

not quite there yet... ;)

Usage
--------


To use this plugin, include it after `pouchdb.js` in your HTML page:

```html
<script src="pouchdb.js"></script>
<script src="pouchdb.users.js"></script>
```

Or to use it in Node.js, just npm install it:

```
npm install pouchdb-users
```

And then attach it to the `PouchDB` object:

```js
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-users'));

// create a user with name and password
new PouchDB('users').createUser(name, pass, function (err, res) {})

// log in the user
new PouchDB('users').login(name, pass, function (err, res) {})
```

Testing
----

### In Node

This will run the tests in Node using LevelDB:

    npm test
    
You can also check for 100% code coverage using:

    npm run coverage

If you don't like the coverage results, change the values from 100 to something else in `package.json`, or add `/*istanbul ignore */` comments.


If you have mocha installed globally you can run single test with:
```
TEST_DB=local mocha --reporter spec --grep search_phrase
```

The `TEST_DB` environment variable specifies the database that PouchDB should use (see `package.json`).

### In the browser

Run `npm run dev` and then point your favorite browser to [http://127.0.0.1:8001/test/index.html](http://127.0.0.1:8001/test/index.html).

The query param `?grep=mysearch` will search for tests matching `mysearch`.

### Automated browser tests

You can run e.g.

    CLIENT=selenium:firefox npm test
    CLIENT=selenium:phantomjs npm test

This will run the tests automatically and the process will exit with a 0 or a 1 when it's done. Firefox uses IndexedDB, and PhantomJS uses WebSQL.