#!/usr/bin/env node

/*
jscomplex
@class jscomplex
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var Complex, defaults, dep, dev, options, program, start;

program = require('commander');

Complex = require('../lib/jscomplex');


/*
 * program configuration.
 */

program.version(require('../package.json').version)
	.usage('[options]')
	.option('--dep', 'show only Dependencies.')
	.option('--dev', 'show only dev Dependencies.');

program.on('--help', function() {
	console.log('  Examples:');
	console.log('');
	console.log('    # show only dev Dependencies');
	console.log('    $ jscomplex --dev');
	console.log('');
	console.log('    # show only Dependencies');
	console.log('    $ jscomplex --dep');
	return console.log('');
});

program.parse(process.argv);


/*
 * Program options.
 */

options = {};

options.dev = program.dev || false;

options.dep = program.dep || false;


/*
 * Functions.
 */

start = function(options) {
	var dependencies;
	if (options) {
		dependencies = new Complex(options);
	} else {
		dependencies = new Complex();
	}
	return process.exit();
};

defaults = function() {
	return start();
};

dev = function() {
	options = {
		namesOfMyDependencies: ['devDependencies']
	};
	start(options);
};

dep = function() {
	options = {
		namesOfMyDependencies: ['dependencies']
	};
	start(options);
};


/*
 * Run Functions.
 */

if (options.dev) {
	dev();
}

if (options.dep) {
	dep();
}

defaults();
