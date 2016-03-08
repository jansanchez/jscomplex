#!/usr/bin/env node
'use strict';

const color = require('chalk');
const escomplex = require('escomplex');
const vinyl = require('vinyl-fs');
const map = require('map-stream');
const Symbol = require('./symbol');
const s = new Symbol();

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

	purgeCode(code) {
		let newCode = code;
		if (code.charAt(0) === '#') {
			const lines = code.split('\n');
			lines.splice(0, 1);
			newCode = lines.join('\n');
		}
		return newCode;
	}

	generator(score, threshold) {
		const magnitude = Math.floor(score / (this.options.maintainability / 10));
		const bar = `${s.getSymbol('bullet').repeat(magnitude / 2)}  ${score.toFixed(2)}`;
		const rating = score / threshold;

		let color = 'red';
		let arrow = s.getSymbol('downwards');

		if (rating >= 0.50) {
			color = 'yellow';
		}
		if (rating >= 0.80) {
			arrow = s.getSymbol('upwards');
			color = 'green';
		}

		return {
			magnitude,
			bar,
			rating,
			color,
			symbol: arrow
		};
	}

	process() {
		vinyl.src(this.path)
			.pipe(map((data, callback) => {
				const code = data.contents.toString('utf8');
				const newCode = this.purgeCode(code);
				const result = escomplex.analyse([{path: data.relative, code: newCode}], this.options);
				const values = this.generator(result.reports[0].maintainability, this.options.maintainability);

				console.log(color[values.color](`${values.symbol}  ${result.reports[0].path}  ${values.bar}`));

				if (values.color === 'red') {
					result.reports[0].functions.forEach(fn => {
						console.log(color.white.dim(`   ${s.getSymbol('rightwards')} line: ${fn.line}, method: ${fn.name}, cyclomatic: ${fn.cyclomatic}, effort: ${fn.halstead.effort.toFixed(2)}, vocabulary: ${fn.halstead.vocabulary}`));
					});
					if (result.reports[0].functions.length === 0) {
						console.log(color.white.dim(`   ${s.getSymbol('rightwards')} line: ${result.reports[0].aggregate.line}, method: ${result.reports[0].aggregate.name}, cyclomatic: ${result.reports[0].aggregate.cyclomatic}, effort: ${result.reports[0].aggregate.halstead.effort.toFixed(2)}, vocabulary: ${result.reports[0].aggregate.halstead.vocabulary}`));
					}
				}
				callback(null, data);
			}));
	}
}

const complex = new Complex(['./index.js', './symbol.js']);
complex.process();

module.exports = Complex;
