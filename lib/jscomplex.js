#!/usr/bin/env node
'use strict';

const color = require('chalk');
const escomplex = require('escomplex');
const vinyl = require('vinyl-fs');
const map = require('map-stream');
const Symbol = require('./symbol');
const symbols = new Symbol();

class Complex {
	constructor(path, options) {
		if (!options) {
			options = {};
		}
		this._options = {
			json: options.json || false,
			logicalor: !options.logicalor,
			switchcase: !options.switchcase,
			forin: options.forin || false,
			trycatch: options.trycatch || false,
			newmi: options.newmi || false,
			ignoreErrors: options.ignoreerrors || false,
			noCoreSize: options.nocoresize || false,
			maintainability: options.maintainability || 171
		};
		this._media = 0;
		this._counter = 0;
		this._accumulator = 0;
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
		this._path = this.createPath(path);
		this._json = {};
	}

	get json() {
		return this._json;
	}

	get counter() {
		return this._counter;
	}

	get accumulator() {
		return this._accumulator;
	}

	get media() {
		return this._media;
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

	createPath(path) {
		const arrayPath = [];
		let temporalPath = '';
		if (typeof path === 'undefined' || path === null) {
			return ['./**/*.js'];
		}
		if (typeof path === 'string') {
			temporalPath = path.replace(/\[|\]|\'|\"/ig, '');
			temporalPath.split(',').forEach(item => {
				arrayPath.push(item.trim());
			});
			return arrayPath;
		}
		return path;
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

		this._accumulator = parseFloat(this.accumulator) + parseFloat(score.toFixed(2));
		this._counter = parseFloat(this.counter) + 1;

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

	process(cb) {
		const json = {};
		json.path = this.path;
		json.maintainability = this.options.maintainability;
		json.files = [];
		let output = (color.gray.dim(`Inspectioning in: ${this.path}\n`));

		if (typeof cb === 'undefined') {
			cb = function (data) {
				return data;
			};
		}

		vinyl.src(this.path)
			.pipe(map((data, callback) => {
				let code = '';
				try {
					code = data.contents.toString('utf8');
				} catch (e) {
					// console.log(e);
				}
				const newCode = this.purgeCode(code);
				let result = {};
				try {
					result = escomplex.analyse([{path: data.relative, code: newCode}], this.options);
					const values = this.generator(result.reports[0].maintainability, this.options.maintainability);
					json.files.push({file: result.reports[0].path, mi: result.reports[0].maintainability.toFixed(2), magnitude: values.magnitude});
					output += (color[values.color](` ${values.symbol}  ${result.reports[0].path}  ${values.bar}\n`));

					if (values.color === 'red') {
						result.reports[0].functions.forEach(fn => {
							output += (color.white.dim(`    ${symbols.getSymbol('rightwards')} line: ${fn.line}, method: ${fn.name}, cyclomatic: ${fn.cyclomatic}, effort: ${fn.halstead.effort.toFixed(2)}, vocabulary: ${fn.halstead.vocabulary}\n`));
						});
						if (result.reports[0].functions.length === 0) {
							output += (color.white.dim(`    ${symbols.getSymbol('rightwards')} line: ${result.reports[0].aggregate.line}, method: ${result.reports[0].aggregate.name}, cyclomatic: ${result.reports[0].aggregate.cyclomatic}, effort: ${result.reports[0].aggregate.halstead.effort.toFixed(2)}, vocabulary: ${result.reports[0].aggregate.halstead.vocabulary}\n`));
						}
					}
					callback(null, data);
				} catch (e) {
					output += (color.red.underline(`\nThis file could not be analyzed:\n`));
					output += (color.white.dim(` - ${e.message}\n`));
					callback(null, data);
				}
			}))
			.on('end', () => {
				json.average = (this.accumulator / this.counter).toFixed(2);
				output += (`\n${color.white(' Average IM per project: ')} ${color.white.bold((this.accumulator / this.counter).toFixed(2))}\n`);
				this._json = json;
				if (this.options.json) {
					cb(this._json);
				} else {
					console.log(output);
				}
				return this._json;
			});
	}
}
module.exports = Complex;
