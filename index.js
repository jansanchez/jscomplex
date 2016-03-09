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
const Complex = require('./lib/jscomplex');

/*
 * Instantiating and running.
 */
const complex = new Complex(['./**/*.js']);
complex.process();

module.exports = Complex;
