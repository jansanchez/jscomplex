#!/usr/bin/env node

/*
jscomplex
@class jscomplex
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
var Complex, defaults, options, program, start, dep, dev;

program = require('commander');
Complex = require('../lib/jscomplex');


/*
 * program configuration.
 */
program.version(require('../package.json').version)
	.arguments('path <path>')
	.action((path) => {
		var complex = new Complex(path);
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



