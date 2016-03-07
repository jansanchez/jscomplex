#!/usr/bin/env node
'use strict';

const color = require('chalk');
const escomplex = require('escomplex');
const vinyl = require('vinyl-fs');
const map = require('map-stream');
const Buffer = require('buffer').Buffer;


import {Symbol} from 'symbol';

class Complex {
	constructor(path) {
		this._options = {
			format: 'json',
			logicalor: false,
			switchcase: false,
			forin: false,
			trycatch: false,
			newmi: false,
			ignoreErrors: false,
			noCoreSize: false,
			maintainability: 171
		};
		this._path = path;
	}

	get options() {
		return this._options;
	}

	get path() {
		return this._path;
	}



}

const complex = new Complex(['./index.js']);
const symbol = new Symbol();

console.log(`${symbol.icon(bullet)}`);

const generator = (score, threshold) => {
	const magnitude = Math.floor(score / (complex.options.maintainability / 10));
	const bar = `${symbol.bullet.repeat(magnitude / 2)}  ${score.toFixed(2)}`;
	const rating = score / threshold;
	let color = 'red';
	let arrow = symbol.downwards;
	if (rating >= 0.50) {
		color = 'yellow';
	}
	if (rating >= 0.80) {
		arrow = symbol.upwards;
		color = 'green';
	}
	return {
		magnitude,
		bar,
		rating,
		color,
		symbol: arrow
	};
};

const purgeCode = (code) => {
	let newCode = code;
	if (code.charAt(0) === '#') {
		let lines = code.split('\n');
		lines.splice(0, 1);
		newCode = lines.join('\n');
	}
	return newCode;
};

vinyl.src(['./index.js'])
	.pipe(map((data, callback) => {
		const code = data.contents.toString('utf8');
		let newCode = purgeCode(code);
		const result = escomplex.analyse([{path: data.relative, code: newCode}], complex.options);
		const values = generator(result.reports[0].maintainability, complex.options.maintainability);

		console.log(color[values.color](`${values.symbol}  ${result.reports[0].path}  ${values.bar}`));

		if (values.color === 'red') {
			result.reports[0].functions.forEach(fn => {
				console.log(color.white.dim(`   ${symbol.rightwards} line: ${fn.line}, method: ${fn.name}, cyclomatic: ${fn.cyclomatic}, effort: ${fn.halstead.effort.toFixed(2)}, vocabulary: ${fn.halstead.vocabulary}`));
			});
			if (result.reports[0].functions.length === 0) { // if (result.reports[0].aggregate.hasOwnProperty('name')) {
				console.log(color.white.dim(`   ${symbol.rightwards} line: ${result.reports[0].aggregate.line}, method: ${result.reports[0].aggregate.name}, cyclomatic: ${result.reports[0].aggregate.cyclomatic}, effort: ${result.reports[0].aggregate.halstead.effort.toFixed(2)}, vocabulary: ${result.reports[0].aggregate.halstead.vocabulary}`));
			};
		}
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
