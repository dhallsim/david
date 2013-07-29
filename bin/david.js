#!/usr/bin/env node

var david = require('../');
var argv = require('optimist').argv;
var fs = require('fs');
var npm = require('npm');
var cwd = process.cwd();
var packageFile = cwd + '/package.json';

var blue  = '\033[34m';
var reset = '\033[0m';
var green = '\033[32m';
var gray = '\033[90m';
var yellow = '\033[33m';

if (argv.v || argv.version) {
  console.log(require('../package.json').version);
  return;
}

argv.update = argv._.indexOf('update') > -1 || argv._.indexOf('u') > -1;

function printDeps (deps, type) {
  if (!Object.keys(deps).length) {
    return;
  }
  
  type = type ? type + ' ' : '';

  var oneline = ['npm install'];
  
  if (type == 'Dev ') {
    oneline.push('--save-dev');
  } else if (type == 'Global ') {
    oneline.push('--global');
  } else {
    oneline.push('--save');
  }

  console.log('');
  console.log('%sOutdated %sDependencies%s', yellow, type, reset);
  console.log('');

  for (var name in deps) {
    var dep = deps[name];
    oneline.push(name+'@'+dep.stable);
    console.log('%s%s%s %s(package:%s %s, %slatest: %s%s%s)%s', 
                green,
                name,
                reset,

                gray,
                blue,
                dep.required,

                gray,
                blue,
                dep.stable,
                gray,
                reset
               );
  }
  console.log('');
  console.log('%s%s%s', gray, oneline.join(' '), reset);
  console.log('');
}

// Get updated deps and devDeps
function getDeps (pkg, cb) {
  
  david.getUpdatedDependencies(pkg, { stable: true }, function (er, deps) {
    if (er) return cb(er);
    
    david.getUpdatedDependencies(pkg, { dev: true, stable: true }, function (er, devDeps) {
      cb(er, deps, devDeps);
    });
  });
}

/**
 * Install the passed dependencies
 * 
 * @param {Object} deps Dependencies to install (result from david)
 * @param {Object} opts Install options
 * @param {Boolean} [opts.global] Install globally
 * @param {Boolean} [opts.save] Save installed dependencies to dependencies/devDependencies
 * @param {Boolean} [opts.dev] Provided dependencies are dev dependencies
 * @param {Function} cb Callback
 */
function installDeps (deps, opts, cb) {
  
  opts = opts || {};
  
  var installArgs = [];
  
  for (var name in deps) {
    var dep = deps[name];
    installArgs.push(name + '@' + dep.stable);
  }
  
  npm.load({global: opts.global}, function (er) {
    if (er) return cb(er);
    
    if (opts.save) {
      npm.config.set('save' + (opts.dev ? '-dev' : ''), true);
    }
    
    npm.commands.install(installArgs, function (er) {
      npm.config.set('save' + (opts.dev ? '-dev' : ''), false);
      cb(er);
    });
  });
}

if (argv.g || argv.global) {

  npm.load({ global: true }, function(err) {
    if (err) throw err;
    
    npm.commands.ls([], true, function(err, data) {
      if (err) throw err;
      
      var pkg = {
        name: 'Global Dependencies',
        dependencies: {}
      };
      
      for (var key in data.dependencies) {
        pkg.dependencies[key] = data.dependencies[key].version;
      }
      
      getDeps(pkg, function (er, deps) {
        if (er) return console.error('Failed to get updated dependencies/devDependencies', er);
        
        if (argv.update) {
          
          installDeps(deps, {global: true}, function (er) {
            if (er) return console.error('Failed to update global dependencies', er);
          });
          
        } else {
          printDeps(deps, 'Global');
        }
      });
    });
  });
  
} else {
  
  if (!fs.existsSync(packageFile)) {
    return console.error('package.json does not exist');
  }
  
  var pkg = require(cwd + '/package.json');
  
  getDeps(pkg, function (er, deps, devDeps) {
    if (er) return console.error('Failed to get updated dependencies/devDependencies', er);
    
    if (argv.update) {
      
      installDeps(deps, {save: true}, function (er) {
        if (er) return console.error('Failed to update/save dependencies', er);
        
        installDeps(devDeps, {save: true, dev: true}, function (er) {
          if (er) return console.error('Failed to update/save devDependencies', er);
        });
      });
      
    } else {
      printDeps(deps);
      printDeps(devDeps, 'Dev');
    }
  });
}


