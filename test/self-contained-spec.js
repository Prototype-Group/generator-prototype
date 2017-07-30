/*global describe, beforeEach, it*/
'use strict';

const fs = require('fs');
const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const srcPath = 'src/';
const helperPath = 'configs/';

describe('Self contained project structure with Grunt', function () {
	const answers = require('../test_helpers/prompt-answer-factory')({
		'selfContained': true,
		'taskRunner': [
			'grunt'
		]
	});

	beforeEach(function (done) {
		helpers.run(path.join(__dirname, '../generators/app'))
			.inDir(path.join(__dirname, 'tmp'))
			.withOptions({
				'skip-install': true,
				'skip-welcome-message': true
			})
			.withPrompts(answers)
			.on('end', done);
	});

	it('adds setting in config.js', function () {
		assert.fileContent('configs/config.js', /self-contained/);
	});

	it('adds further paths to watch.js file', function () {
		assert.fileContent(helperPath + '_grunt/chokidar.js', /shared\/components\/\*\*\/scss\/\*\*\/\*\.scss/);
	});
});

describe('Self contained project structure with Gulp', function () {
	const answers = require('../test_helpers/prompt-answer-factory')({
		'selfContained': true,
		'taskRunner': [
			'gulp'
		]
	});

	beforeEach(function (done) {
		helpers.run(path.join(__dirname, '../generators/app'))
			.inDir(path.join(__dirname, 'tmp'))
			.withOptions({
				'skip-install': true,
				'skip-welcome-message': true
			})
			.withPrompts(answers)
			.on('end', done);
	});

	it('adds setting in config.js', function () {
		assert.fileContent('configs/config.js', /self-contained/);
	});
});