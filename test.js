#!/usr/bin/env node
'use strict';

/*
test of jscomplex
@author Jan Sanchez
*/

import test from 'ava';
const Complex = require('./lib/jscomplex');

const complex = new Complex(null, {maintainability: 200});
complex.process();

test('Options: format', t => {
	t.same(complex.options.json, false);
});

test('Options: logicalor', t => {
	t.true(complex.options.logicalor);
});

test('Options: switchcase', t => {
	t.true(complex.options.switchcase);
});

test('Options: forin', t => {
	t.false(complex.options.forin);
});

test('Options: trycatch', t => {
	t.false(complex.options.trycatch);
});

test('Options: newmi', t => {
	t.false(complex.options.newmi);
});

test('Options: newmi', t => {
	t.false(complex.options.newmi);
});

test('Options: ignoreErrors', t => {
	t.false(complex.options.ignoreErrors);
});

test('Options: noCoreSize', t => {
	t.false(complex.options.noCoreSize);
});

test('Options: maintainability is equal to 200', t => {
	t.same(complex.options.maintainability, 200);
});

test('Path is Array', t => {
	t.true(Array.isArray(complex.path));
});

test('Path[0] is equal to "./**/*.js"', t => {
	t.same(complex.path[0], './**/*.js');
});
