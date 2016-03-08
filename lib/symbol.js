#!/usr/bin/env node
'use strict';

class Symbol {
	constructor() {
		this._ascii = {
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
	}

	get ascii() {
		return this._ascii;
	}

	getSymbol(symbol) {
		return this._ascii[symbol];
	}
}
// Simbolos extraídos desde http://graphemica.com/

module.exports = Symbol;
