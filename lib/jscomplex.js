#!/usr/bin/env node
'use strict';

const color = require('chalk');
const escomplex = require('escomplex');
const vinyl = require('vinyl-fs');
const map = require('map-stream');
const Symbol = require('./symbol');
const symbols = new Symbol();

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
		this._avg = {
			low: {
				value: 0,
				color: 'red'
			},
			medium: {
				value: 0.5,
				color: 'yellow'
			},
			high: {
				value: 0.75,
				color: 'green'
			}
		};
		this._path = path;
	}

	get avg() {
		return this._avg;
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
		const bar = `${symbols.getSymbol('bullet').repeat(magnitude / 2)}  ${score.toFixed(2)}`;
		const rating = score / threshold;

		let color = this.avg.low.color;
		let arrow = symbols.getSymbol('downwards');

		if (rating >= this.avg.medium.value) {
			color = this.avg.medium.color;
		}
		if (rating >= this.avg.high.value) {
			color = this.avg.high.color;
			arrow = symbols.getSymbol('upwards');
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

				console.log(color[values.color](` ${values.symbol}  ${result.reports[0].path}  ${values.bar}`));

				if (values.color === 'red') {
					result.reports[0].functions.forEach(fn => {
						console.log(color.white.dim(`    ${symbols.getSymbol('rightwards')} line: ${fn.line}, method: ${fn.name}, cyclomatic: ${fn.cyclomatic}, effort: ${fn.halstead.effort.toFixed(2)}, vocabulary: ${fn.halstead.vocabulary}`));
					});
					if (result.reports[0].functions.length === 0) {
						console.log(color.white.dim(`    ${symbols.getSymbol('rightwards')} line: ${result.reports[0].aggregate.line}, method: ${result.reports[0].aggregate.name}, cyclomatic: ${result.reports[0].aggregate.cyclomatic}, effort: ${result.reports[0].aggregate.halstead.effort.toFixed(2)}, vocabulary: ${result.reports[0].aggregate.halstead.vocabulary}`));
					}
				}
				callback(null, data);
			}));
	}
}

module.exports = Complex;
