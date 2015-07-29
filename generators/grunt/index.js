'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var gruntGenerator = require('../../generator-files/grunt-generator');

module.exports = yeoman.generators.Base.extend({

	// Initialize general settings and store some files
	initializing: function () {
		this.config.defaults({
			taskRunner: [
				'grunt'
			],
			templateEngine: '',
			installExtendedLayout: false,
			installPlugin: false,
			gulpModules: [],
			gruntModules: [],
			features: [],
			jsLibs: [],
			cssLibs: [],
			testAndQA: false,
			testAndQALibs: [],
			pgPackages: [],
			installProxy: false,
			proxyHost: '0.0.0.0 ',
			proxyPort: 80,
			author: {
				name: "",
				login: "",
				email: ""
			}
		});
	},

	// Custom prompts routine
	prompting: function () {
		console.log(
			('\n') + chalk.bgMagenta('Install your grunt modules') + ('\n') +
			('\n') + chalk.magenta('* Be sure you know what you do') +
			('\n') + chalk.magenta('Additional add your custom grunt task in your Gruntfile.js') + ('\n')
		);

		var questions = [];
		var cb = this.async();

		questions.push({
			name: "helperPath",
			message: "What is the name of your helpers folder?",
			default: "helpers"
		});

		questions.push({
			name: "gruntPath",
			message: "Where do you have your task files?",
			default: "helpers/_grunt"
		});

		questions.push({
			name: "srcPath",
			message: "Where do you have your source files?",
			default: "resources"
		});

		questions = questions.concat(
			gruntGenerator.questions.call(this, {
				taskRunner: [
					'grunt'
				],
				defaults: false
			})
		);

		this.prompt(questions, function (answers) {
			this.helperPath = answers.helperPath;
			this.gruntPath = answers.gruntPath;
			this.srcPath = answers.srcPath;

			this.projectName = this.config.get('projectName');
			this.authorLogin = this.config.get('projectAuthor');
			this.taskRunner = this.config.get('taskRunner');
			this.templateEngine = this.config.set('templateEngine', 'assemble');
			this.installExtendedLayout = this.config.set('installExtendedLayout', true);
			this.plugin = this.config.get('plugin');
			this.gulpModules = this.config.get('gulpModules');
			this.gruntModules = answers.gruntModules || this.config.get('gruntModules');
			this.features = this.config.get('features');
			this.jsLibs = this.config.get('jsLibs');
			this.cssLibs = this.config.get('cssLibs');
			this.testAndQA = this.config.get('testAndQA');
			this.testAndQALibs = this.config.get('testAndQALibs');
			this.pgPackages = this.config.get('pgPackages');
			this.authorName = this.config.get('author').name;
			this.authorEmail = this.config.get('author').email;
			this.proxyHost = this.config.get('proxyHost');
			this.proxyPort = this.config.get('proxyPort');

			//save config to .yo-rc.json
			this.config.set(answers);

			cb();
		}.bind(this));

	},

	/**
	 * Grunt modules file generation
	 *
	 */
	writing: {
		setup: function () {
			gruntGenerator.setup.call(this);
		},
		grunt: function () {
			gruntGenerator.scaffold.call(this, {
				defaults: false,
				installDeps: true
			});
		}
	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install'] || this.options['s'],
			skipMessage: this.options['skip-welcome-message'] || this.options['w']
		});
	}
});