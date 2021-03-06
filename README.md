[![David](https://raw.github.com/alanshaw/david-www/master/david.png)](https://david-dm.org/)

[![Build Status](https://img.shields.io/travis/alanshaw/david/master.svg)](https://travis-ci.org/alanshaw/david)
[![Coverage Status](http://img.shields.io/coveralls/alanshaw/david.svg)](https://coveralls.io/r/alanshaw/david?branch=master)
[![Dependency Status](https://david-dm.org/alanshaw/david.svg?theme=shields.io)](https://david-dm.org/alanshaw/david)
[![devDependency Status](https://david-dm.org/alanshaw/david/dev-status.svg?theme=shields.io)](https://david-dm.org/alanshaw/david#info=devDependencies)
[![Donate to help support David development](http://img.shields.io/gittip/_alanshaw.svg)](https://www.gittip.com/_alanshaw/)
___

Node.js module that tells you when your package NPM dependencies are out of date.


## Getting Started

Install [Node.js](http://nodejs.org/).

Install david:

```sh
cd /your/project/directory
npm install david
```

Use:

```javascript
var david = require('david');

// Your package.json
var manifest = {
  name: 'xxx',
  dependencies: {
    'aaa': '~0.0.0',
    'bbb': '~0.0.0'
  },
  devDependencies: {
    'yyy': '~0.0.0',
    'zzz': '~0.0.0'
  }
};

david.getDependencies(manifest, function (er, deps) {
  console.log('latest dependencies information for', manifest.name);
  listDependencies(deps);
});

david.getDependencies(manifest, { dev: true }, function (er, deps) {
  console.log('latest devDependencies information for', manifest.name);
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, function (er, deps) {
  console.log('dependencies with newer versions for', manifest.name);
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, { dev: true }, function (er, deps) {
  console.log('devDependencies with newer versions for', manifest.name);
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, { stable: true }, function (er, deps) {
  console.log('dependencies with newer STABLE versions for', manifest.name);
  listDependencies(deps);
});

david.getUpdatedDependencies(manifest, { dev: true, stable: true }, function (er, deps) {
  console.log('devDependencies with newer STABLE versions for', manifest.name);
  listDependencies(deps);
});

function listDependencies(deps) {
  Object.keys(deps, function(depName) {
    var required = deps[depName].required || '*';
    var stable = deps[depName].stable || 'None';
    var latest = deps[depName].latest;
    console.log('%s Required: %s Stable: %s Latest: %s', depName, required, stable, latest);
  });
}
```

Both `getDependencies` and `getUpdatedDependencies` return an object result,
whose keys are package names. The values are objects which contain the following properties:

* `required` - The version required according to the manifest
* `stable` - The latest stable version available
* `latest` - The latest version available (including build and patch versions)


## CLI

If you install David globally with `npm install -g david`, you can run `david`
in your project directory to see which dependencies are out of date.

You can also run `david --global` to see your outdated global dependencies.

### Update to latest

To update all your project dependencies to the latest **stable** versions,
and save to your `package.json`, run:

```sh
david update
```

You can also update global dependencies to latest versions:

```sh
david update --global
```

To update all your project dependencies to the latest versions
(including unstable versions), pass the `--unstable` flag:

```sh
david update --unstable
```

Use an alternate reigstry:

```sh
david update --registry http://registry.nodejitsu.com/
```


Release History
---------------

* 2014-03-11   v3.1.0   CLI Add `-r, --registry` option to use alternate npm registry
* 2014-03-06   v3.0.0   Errors occurring whilst retrieving dependency status doesn't halt processing of other dependencies. An error object will be returned as first arg to callback, but status info for remaining dependencies will still be available (as second arg). CLI now uses loose semver version parsing. Also update npm dependency so `david update` uses "^" as per https://github.com/npm/npm/issues/4587
* 2013-10-27   v2.4.0   Removes `semverext.js`. The `gtr` function is now available in `semver`
* 2013-10-08   v2.3.0   Support update specific modules from CLI via `david update [module]`
* 2013-10-01   v2.2.0   Support for `optionalDependencies` and `peerDependencies`
* 2013-09-16   v2.1.0   Fixed issues with latest/stable version detection
* 2013-08-25   v2.0.0   Simplification refactor to remove caching and useless events. Code style changes, performance improvements.
* 2013-08-04   v1.9.0   CLI added `--unstable` flag to view/update to latest _unstable_ dependency versions
* 2013-07-30   v1.8.0   CLI added `david update` to update dependencies to latest _stable_ versions and save to your project `package.json`
* 2013-06-27   v1.7.0   Updated to use semver 2 module. Simplified code that determines if a version is greater than a range
* 2013-03-28   v1.6.0   Use `setImmediate` instead of `process.nextTick`. David now requires Node.js 0.10.x
* 2013-03-27   v1.5.0   CLI added `--global` flag to find outdated global dependencies
* 2013-03-15   v1.4.0   Allow set the maximum number of dependencies that can be stored in the cache
* 2013-03-14   v1.3.0   Added CLI support
* 2013-03-05   v1.2.0   David can now get dependency information for `devDependencies`
* 2013-02-07   v1.1.0   Adds `onlyStable` param to `getUpdatedDependencies` to filter by dependencies that are updated and stable
* 2013-02-06   v1.0.0   Return latest stable version as well as latest version (including patch and build versions). API return values changed. Events changed.
