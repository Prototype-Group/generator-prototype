/*global describe, beforeEach, it*/
'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var srcPath = "resources/";
var helperPath = "helpers/";

describe('task runner is Grunt', function () {
	var answers = require('../test_helpers/prompt-answer-factory')({
		"taskRunner": [
			"grunt"
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

	it('adds references to package.json', function () {
		assert.fileContent('package.json', /grunt/);
	});

	it('creates Gruntfile.js', function () {
		assert.file('Gruntfile.js');
	});

	it('creates default files', function () {
		var expected = [
			// add files you expect to exist here.
			helperPath + '_grunt/clean.js',
			helperPath + '_grunt/concurrent.js',
			helperPath + '_grunt/express.js',
			helperPath + '_grunt/cssmin.js',
			helperPath + '_grunt/sync.js',
			helperPath + '_grunt/watch.js'
		];
		assert.files(expected);
	});

	it('adds standard tasks to watch.js file', function () {
		assert.fileContent(helperPath + '_grunt/watch.js', /livereload/);
		assert.fileContent(helperPath + '_grunt/watch.js', /ajax/);
		assert.fileContent(helperPath + '_grunt/watch.js', /assets/);
		assert.fileContent(helperPath + '_grunt/watch.js', /js/);
		assert.fileContent(helperPath + '_grunt/watch.js', /\'sync\:js\'/);
		assert.fileContent(helperPath + '_grunt/watch.js', /scss/);
		assert.fileContent(helperPath + '_grunt/watch.js', /express/);
	});

	it('adds standard tasks to sync.js file', function () {
		assert.fileContent(helperPath + '_grunt/sync.js', /assets/);
		assert.fileContent(helperPath + '_grunt/sync.js', /ajax/);
		assert.fileContent(helperPath + '_grunt/sync.js', /js/);
	});

});

describe('task runner is Gulp', function () {
	var answers = require('../test_helpers/prompt-answer-factory')({
		"taskRunner": [
			"gulp"
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

	it('adds references to package.json', function () {
		assert.fileContent('package.json', /gulp/);
	});

	it('creates Gruntfile.js', function () {
		assert.file('Gulpfile.js');
	});
});