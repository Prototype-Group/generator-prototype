/*global describe, beforeEach, it*/
'use strict';

const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const fs = require('fs');
const answers = require('../test_helpers/prompt-answer-factory')({
	"gruntModules": [
		"grunt-includes"
	]
});

describe('grunt-includes', function () {
	const helperPath = 'helpers/';
	const srcPath = 'resources/';

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

	it('adds references to package.json', function () {
		assert.fileContent('package.json', /grunt-includes/);
	});

	it('creates helper files', function () {
		assert.file(helperPath + "_grunt/includes.js");
	});

	it('adds task to watch file', function () {
		assert.fileContent(helperPath + "_grunt/chokidar.js", /includes\:js/);
	});

	it('adds task to Gruntfile.js', function () {
		assert.fileContent('Gruntfile.js', /includes\:js/);
	});

	it('adds app.js, main.js to js folder', function () {
		assert.file([
			srcPath + 'js/app.js',
			srcPath + 'js/main.js'
		]);
	});
});