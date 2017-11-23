/*global describe, beforeEach, it*/
'use strict';

const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const fs = require('fs');

describe('Mangony', function () {
	const srcPath = 'src/app/';
	const helperPath = 'configs/tasks/';

	describe('adds standard files and configs to project', function () {
		const answers = require('../test_helpers/prompt-answer-factory')({
			'templateEngine': 'ssr-mangony-hbs'
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

		it('creates resources files', function () {
			const expected = [
				srcPath + 'core/layouts/lyt-default.hbs',
				srcPath + 'pages/index/index.hbs',
				srcPath + 'core/components/_scripts.hbs',
				srcPath + 'core/components/_metadata.hbs',
				srcPath + 'core/components/_styles.hbs'
			];
			const notExpected = [
				srcPath + 'shared/utilities/template-helpers/alias.js',
				srcPath + 'shared/utilities/template-helpers/helper-wrapWith.js',
				srcPath + 'shared/utilities/template-helpers/helper-ifBlock.js'
			];
			assert.file(expected);
			assert.noFile(notExpected);

		});

		it('the index.hbs contains extend syntax', function () {
			assert.fileContent(srcPath + 'pages/index/index.hbs', /{{#extend/);
		});
	});

	describe('Grunt installation', function () {
		const answers = require('../test_helpers/prompt-answer-factory')({
			'templateEngine': 'ssr-mangony-hbs'
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
			assert.fileContent('package.json', /grunt-mangony/);
		});

		it('creates helper files', function () {
			assert.file(helperPath + '_grunt/mangony.js');
		});

		it('adds dependencies and functions to server/modules/express.js', function () {
			assert.fileContent('src/server/modules/express.js', /Mangony/);
			assert.fileContent('src/server/modules/express.js', /createMangony/);
			assert.fileContent('src/server/modules/express.js', /mangony.render()/);
		});

		it('adds and deletes task to Gruntfile.js file', function () {
			assert.fileContent('Gruntfile.js', /mangony:dist/);
		});
	});
});
