#!/usr/bin/env node
'use strict';

const color = require('chalk');
const escomplex = require('escomplex');
const vinyl = require('vinyl-fs');
const map = require('map-stream');

const symbol = {
	bullet: '\u2022',
	block: '\u258C',
	upwards: '\u2191',
	downwards: '\u2193',
	rightwards: '\u2192',
	leftwards: '\u2190',
	ogham: '\u168F',
	circle: '\u0E4F',
	updashed: '\u21E1',
	downdashed: '\u21E3',
	rightdashed: '\u21E2',
	asterisk: '\u066D',
	pipe: '\u104A',
	pipe2: '\u2016',
	separator: '\u10FB',
	proof: '\u220E',
	account: '\u2449',
	bar: '\u2AF4'
};
// The Symbols was extracted from http://graphemica.com/

const options = {
	format: 'json',
	logicalor: false,
	switchcase: false,
	forin: false,
	trycatch: false,
	newmi: false,
	ignoreErrors: false,
	noCoreSize: false
};

vinyl.src(['./demo/**/*.js'])
	.pipe(map((data, callback) => {
		const code = data.contents.toString('utf8');
		const result = escomplex.analyse([{path: data.relative, code}], options);

		console.log(color.green(`${symbol.upwards}  ${result.reports[0].path}  ${(result.reports[0].maintainability.toFixed(2)).slice(-6)}  ${symbol.bullet.repeat(5)}`));

		result.reports[0].functions.forEach(f => {
			console.log(color.white.dim(`   ${symbol.rightwards} line: ${f.line}, method: ${f.name}, cyclomatic: ${f.cyclomatic}, effort: ${f.halstead.effort.toFixed(2)}, vocabulary: ${f.halstead.vocabulary}`));
		});
		callback(null, data);
	}));

/*
console.log(color.green(`
${symbol.upwards}  src/manipulation/column.js  170.00  ${symbol.bullet.repeat(5)}
${symbol.downwards}  src/manipulation/string.js  140.05  ${symbol.bullet.repeat(4)}`) +
color.yellow(`
${symbol.downwards}  src/manipulation/string.js  120.05  ${symbol.bullet.repeat(3)}
${symbol.downwards}  src/manipulation/type.js    110.05  ${symbol.bullet.repeat(3)}`) +
color.red(`
${symbol.downwards}  src/manipulation/type.js     99.05  ${symbol.bullet.repeat(2)}
`) + color.gray(`   ${symbol.rightwards} line: 12, method: methodName, cyclomatic: 4, effort: 7.9, vocabulary: 11
   ${symbol.rightwards} line: 18, method: methodName2, cyclomatic: 5, effort: 8.9, vocabulary: 13
   ${symbol.rightwards} line: 25, method: methodName3, cyclomatic: 4, effort: 6.9, vocabulary: 23`) +
color.red(`
${symbol.downwards}  src/manipulation/string.js  85.05  ${symbol.bullet.repeat(2)}
`) + color.gray(`   ${symbol.rightwards} line: 12, method: methodName, cyclomatic: 4, effort: 7.9, vocabulary: 11
   ${symbol.rightwards} line: 18, method: methodName2, cyclomatic: 5, effort: 8.9, vocabulary: 13
`));
*/
