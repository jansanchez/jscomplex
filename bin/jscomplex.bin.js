#!/usr/bin/env node
'use strict';

/*
jscomplex
@class jscomplex
@author Jan Sanchez
 */

/*
 * Module dependencies.
 */
const cli = require('commander');
const Complex = require('../lib/jscomplex');
let pathValue = '';

/*
 * cli configuration.
 */
cli.version(require('../package.json').version)
	.option('-j, --json', 'specify json as the output format of the report')
	.option('-M, --mi <maintainability index>', 'specify the per-module maintainability index threshold', parseFloat)
	.option('-l, --logicalor', 'disregard operator || as source of cyclomatic complexity')
	.option('-w, --switchcase', 'disregard switch statements as source of cyclomatic complexity')
	.option('-i, --forin', 'treat for...in statements as source of cyclomatic complexity')
	.option('-t, --trycatch', 'treat catch clauses as source of cyclomatic complexity')
	.option('-n, --newmi', 'use the Microsoft-variant maintainability index (scale of 0 to 100)')
	.option('-Q, --nocoresize', 'don\'t calculate core size or visibility matrix')
	.arguments('<path>')
	.action((path, options) => {
		pathValue = path;

		options = {
			json: cli.json || false,
			logicalor: !cli.logicalor,
			switchcase: !cli.switchcase,
			forin: cli.forin || false,
			trycatch: cli.trycatch || false,
			newmi: cli.newmi || false,
			ignoreerrors: cli.ignoreerrors || false,
			nocoresize: cli.nocoresize || false,
			maintainability: cli.mi || 171
		};
		const complex = new Complex(path, options);
		complex.process(data => {
			if (options.json === true) {
				console.log(data);
			}
		});
	});

cli.on('--help', () => {
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

cli.parse(process.argv);

if (pathValue === '') {
	const complex = new Complex();
	complex.process();
}
