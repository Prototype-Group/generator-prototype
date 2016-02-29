'use strict';
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var helpers = require('../../lib/helpers');
var configFile = require('../../lib/config');
var taskRunnerGenerator = require('../../generator-files/taskrunner-generator');
var featuresGenerator = require('../../generator-files/features-generator');
var jsGenerator = require('../../generator-files/js-generator');
var cssGenerator = require('../../generator-files/css-generator');
var expressGenerator = require('../../generator-files/express-generator');
var testAndQAGenerator = require('../../generator-files/test-and-qa-generator');
var gruntGenerator = require('../../generator-files/grunt-generator');
var gulpGenerator = require('../../generator-files/gulp-generator');
var veamsGenerator = require('../../generator-files/veams-generator');
var docsGenerator = require('../../generator-files/generator-docs');
var templatingGenerator = require('../../generator-files/templating-generator');

module.exports = yeoman.generators.Base.extend({

	// Initialize general settings and store some files
	initializing: function () {
		this.pkg = require('../../package.json');
		this.bowerFile = this.src.readJSON('_bower.json');

		this.dotFiles = [
			'gitignore',
			'gitattributes',
			'editorconfig',
			'bowerrc',
			'jshintrc'
		];

		this.config.defaults(configFile.setup.empty);
	},

	selectRoutine: function () {
		var cb = this.async();
		var force = false;
		var prompts = [];

		// welcome message
		var welcome = helpers.welcome;

		if (!this.options['skip-welcome-message']) {
			this.log(welcome);
		}

		if (!this.config.existed) {
			force = true;
		}

		(!this.config.get('defaultInstall') || force) && prompts.push({
			name: 'defaultInstall',
			type: 'list',
			message: 'Choose your installation routine:',
			choices: [
				{
					name: 'Custom Installation',
					value: 'customInstall'
				},
				{
					name: 'Minimal Installation',
					value: 'minInstall'
				}
			],
			default: this.config.get('defaultInstall')
		});

		this.prompt(prompts, function (answers) {

			this.defaultInstall = answers.defaultInstall || this.config.get('defaultInstall');

			//save config to .yo-rc.json
			if (this.defaultInstall === 'minInstall') {
				this.log(
					('\n') + chalk.bgCyan('Minimal installation routine selected.') + ('\n')
				);
				this.projectName = this.config.get('projectName');
				this.authorName = this.config.get('projectAuthor');
				this.taskRunner = this.config.set('taskRunner', [
					'grunt'
				]);
				this.templateEngine = this.config.set('templateEngine', 'assemble');
				this.installExtendedLayout = this.config.set('installExtendedLayout', true);
				this.plugin = this.config.get('plugin');
				this.gulpModules = this.config.get('gulpModules');
				this.gruntModules = this.config.set('gruntModules', [
					'grunt-combine-mq',
					'grunt-dr-svg-sprites'
				]);
				this.features = this.config.get('features');
				this.jsLibs = this.config.get('jsLibs');
				this.cssLibs = this.config.get('cssLibs');
				this.testAndQA = this.config.get('testAndQA');
				this.testAndQALibs = this.config.get('testAndQALibs');
				this.veamsPackages = this.config.get('veamsPackages');
				this.docs = this.config.get('docs');

				//save config to .yo-rc.json
				this.config.set(answers);
				cb();
			} else {
				this.log(
					('\n') + chalk.green('Custom installation routine selected.') + ('\n')
				);
				this._prompting();
			}
		}.bind(this));
	},

	_prompting: function () {
		var cb = this.async();
		this.force = false;
		this.questions = [];

		if (!this.config.existed) {
			this.force = true;
		}

		this._prompts();

		this.prompt(this.questions, function (answers) {
			this.authorName = answers.projectAuthor || this.config.get('projectAuthor');
			this.projectName = answers.projectName || this.config.get('projectName');
			this.taskRunner = answers.taskRunner;
			this.gulpModules = answers.gulpModules || this.config.get('gulpModules');
			this.gruntModules = answers.gruntModules || this.config.get('gruntModules');
			this.templateEngine = answers.templateEngine || this.config.get('templateEngine');
			this.installExtendedLayout = answers.installExtendedLayout || this.config.get('installExtendedLayout');
			this.plugin = answers.plugin;
			this.features = answers.features;
			this.jsLibs = answers.jsLibs;
			this.cssLibs = answers.cssLibs;
			this.testAndQA = answers.testAndQA;
			this.testAndQALibs = answers.testAndQALibs;
			this.veamsPackages = answers.veamsPackages;

			//save config to .yo-rc.json
			this.config.set(answers);
			cb();

		}.bind(this));
	},

	_prompts: function () {
		(!this.config.get('projectName') || this.force) && this.questions.push({
			type: 'input',
			name: 'projectName',
			message: 'Your project name',
			default: this.appname
		});

		(!this.config.get('projectAuthor') || this.force) && this.questions.push({
			type: 'input',
			name: 'projectAuthor',
			message: 'Would you mind telling me your name?',
			default: this.config.get('projectAuthor')
		});

		(!this.config.get('taskRunner') || this.force) && this.questions.push(
			taskRunnerGenerator.questions.call(this)
		);

		if (!this.config.get('gruntModules') || this.force) {
			this.questions = this.questions.concat(
				gruntGenerator.questions.call(this)
			);
		}

		(!this.config.get('gulpModules') || this.force) && this.questions.push(
			gulpGenerator.questions.call(this)
		);

		if (!this.config.get('templateEngine') || this.force) {
			this.questions = this.questions.concat(
				templatingGenerator.questions.call(this)
			);
		}

		(!this.config.get('cssLibs') || this.force) && this.questions.push(
			cssGenerator.questions.call(this)
		);

		(!this.config.get('jsLibs') || this.force) && this.questions.push(
			jsGenerator.questions.call(this)
		);

		(!this.config.get('veamsPackages') || this.force) && this.questions.push(
			veamsGenerator.questions.call(this)
		);

		if (!this.config.get('testAndQA') || this.force) {
			this.questions = this.questions.concat(
				testAndQAGenerator.questions.call(this)
			);
		}

		(!this.config.get('docs') || this.force) && this.questions.push(
			docsGenerator.questions.call(this)
		);

		(!this.config.get('features') || this.force) && this.questions.push(
			featuresGenerator.questions.call(this)
		);
	},

	writing: {
		setup: function () {
			taskRunnerGenerator.setup.call(this);
			gruntGenerator.setup.call(this);
			gulpGenerator.setup.call(this);
			templatingGenerator.setup.call(this);
			cssGenerator.setup.call(this);
			expressGenerator.setup.call(this);
			jsGenerator.setup.call(this);
			veamsGenerator.setup.call(this);
			testAndQAGenerator.setup.call(this);
			docsGenerator.setup.call(this);
			featuresGenerator.setup.call(this);
		},

		overwriteSetup: function () {
			veamsGenerator.overwriteSetup.call(this);
		},

		defaults: function () {
			// Standard files
			this.copy('gitignore', '.gitignore');
			this.copy('bowerrc', '.bowerrc');
			this.template('_package.json.ejs', 'package.json');
			this.template('helpers/config.js.ejs', 'helpers/config.js');
			this.template('README.md.ejs', 'README.md');
			this.bowerFile['name'] = this.config.get('projectName');

			this.mkdir('_output');

			// add specific resources to make it possible to split up some directories
			this.mkdir('_output/js');
			this.mkdir('resources');
			this.mkdir('resources/ajax');
			this.mkdir('resources/assets');
			this.mkdir('resources/assets/img');
			this.mkdir('resources/assets/img/temp');
			this.mkdir('resources/assets/img/svg');
			this.mkdir('resources/assets/img/svg/icons');
			this.mkdir('resources/assets/fonts');
			this.mkdir('resources/assets/media');
			this.mkdir('resources/js');
			this.mkdir('resources/scss');
			this.mkdir('resources/scss/utils/extends');
			this.mkdir('resources/scss/utils/mixins');
			this.copy('resources/scss/global/_print.scss');
			this.copy('resources/scss/universal.scss');

			this.template('resources/scss/global/_base.scss.ejs', 'resources/scss/global/_base.scss');
			this.template('resources/scss/global/_vars.scss.ejs', 'resources/scss/global/_vars.scss');
			this.template('resources/scss/_styles.scss.ejs', 'resources/scss/styles.scss');
		},

		scaffold: function () {
			taskRunnerGenerator.scaffold.call(this);
			jsGenerator.scaffold.call(this);
			cssGenerator.scaffold.call(this);
			expressGenerator.scaffold.call(this);
			testAndQAGenerator.scaffold.call(this);
			veamsGenerator.scaffold.call(this);
			templatingGenerator.scaffold.call(this);
			featuresGenerator.scaffold.call(this);
			docsGenerator.scaffold.call(this);

			if (this.taskRunner.indexOf('gulp') !== -1) gulpGenerator.scaffold.call(this);
			if (this.taskRunner.indexOf('grunt') !== -1) gruntGenerator.scaffold.call(this);
		},

		bower: function () {
			if (this.cssLibs.length === 0 && this.jsLibs.length === 0 && this.veamsPackages.length === 0) {
				this.bowerFile['dependencies'] = {};
			}
			this.dest.write('bower.json', JSON.stringify(this.bowerFile, null, 4));
		}
	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install'] || this.options['s'],
			skipMessage: this.options['skip-welcome-message'] || this.options['w'],
			// minInstall: this.options['minimal'] || this.options['min'],
			callback: function () {
				// Emit an event that all dependencies are installed
				this.emit(configFile.events.depsIntalled);
			}.bind(this)
		});
	},

	bindEvents: function () {
		var _this = this;

		this.on(configFile.events.end, function () {
			fs.rename(path.join(this.destinationRoot(), '.yo-rc.json'), path.join(this.destinationRoot(), 'setup.json'), function (err) {
				if (err) _this.log('ERROR: ' + err);
			});
		});
	}
});