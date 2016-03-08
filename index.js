#!/usr/bin/env node
'use strict';

/*
index of jscomplex
@class index
@author Jan Sanchez
 */

/*
 * Module jscomplex.
 */
var Complex, complex;

Complex = require('./lib/jscomplex');

/*
 * Instantiating.
 */

complex = new Complex(['./**/*.js']);
complex.process();


/*
 * Expose library.
 */

module.exports = complex;
