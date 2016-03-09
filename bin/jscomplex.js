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
	console.log('    # analize *.js files');
	console.log('    $ jscomplex');
	return console.log('');
});

program.parse(process.argv);

if (pathValue === '') {
	const complex = new Complex();
	complex.process();
}

