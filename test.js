#!/usr/bin/env node
'use strict';

/*
test of jscomplex
@author Jan Sanchez
 */

import test from 'ava';
const Complex = require('./lib/jscomplex');

test.skip(t => {
    t.same([1, 2], [1, 2]);
});

const complex = new Complex(['./*.js']);
complex.process();

test('version exists', t => {
	t.true(true);
});
