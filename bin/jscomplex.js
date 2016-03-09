#!/usr/bin/env node

/*
jscomplex
@class jscomplex
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var defaults, options, start, dep, dev;

const program = require('commander');
const Complex = require('../lib/jscomplex');
pathValue = '';

/*
 * program configuration.
 */
program.version(require('../package.json').version)
	.arguments('<path>')
	.action((path) => {
		pathValue = path;
		const complex = new Complex(path);
		complex.process();
	});

program.on('--help', function() {
	console.log('  Examples:');
	console.log('');
	console.log('    # Analize all *.js files from "lib" folder');
	console.log('    $ jscomplex \"\[\'./lib/*.js\'\]\"');
	console.log('');
	console.log('    # Analize all *.js files from "lib" and "bin" folder');
	console.log('    $ jscomplex \"\[\'./lib/*.js\'\, \'./bin/*.js\'\]\"');
	console.log('');
	console.log('    # Analize all *.js files');
	console.log('    $ jscomplex \"\[\'./**/*.js\'\]\"');
	return console.log('');
});

program.parse(process.argv);

if (pathValue === '') {
	const complex = new Complex();
	complex.process();
}

