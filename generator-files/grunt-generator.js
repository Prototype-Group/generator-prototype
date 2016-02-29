var chalk = require('chalk');
var helpers = require('./../lib/helpers.js');

exports.questions = function (obj) {
	var object = obj || {};
	object.defaults = object.defaults !== false;

	return [
		{
			when: function (answers) {
				var taskRunner = answers.taskRunner || obj.taskRunner;

				return taskRunner
					&& taskRunner.length > 0
					&& taskRunner.indexOf('grunt') !== -1;
			},
			name: 'gruntModules',
			type: 'checkbox',
			message: 'Which Grunt-Plugins do you want to use?',
			choices: [
				{name: 'grunt-accessibility'},
				{name: 'grunt-autoprefixer', checked: object.defaults},
				{name: 'grunt-bless'},
				{name: 'grunt-browser-sync', checked: object.defaults},
				{name: 'grunt-browserify', checked: object.defaults},
				{name: 'grunt-combine-mq', checked: object.defaults},
				{name: 'grunt-contrib-handlebars'},
				{name: 'grunt-contrib-htmlmin'},
				{name: 'grunt-contrib-requirejs'},
				{name: 'grunt-contrib-uglify'},
				{name: 'grunt-csscomb'},
				{name: 'grunt-dr-svg-sprites', checked: object.defaults},
				{name: 'grunt-grunticon'},
				{name: 'grunt-image-size-export'},
				{name: 'grunt-includes'},
				{name: 'grunt-modernizr'},
				{name: 'grunt-phantomas'},
				{name: 'grunt-photobox'},
				{name: 'grunt-postcss-separator'},
				{name: 'grunt-responsive-images'},
				{name: 'grunt-svgmin'},
				{name: 'grunt-version', checked: object.defaults}
			],
			default: this.config.get('gruntModules')
		}
	];
};

exports.setup = function () {
	helpers.definePaths.call(this);
};

exports.scaffold = function (obj) {
	var object = obj || {};
	object.defaults = object.defaults !== false;

	// Copy standard files
	if (object.defaults) {
		this.template('Gruntfile.js.ejs', 'Gruntfile.js');
		this.mkdir('helpers/_grunt');

		if (this.taskRunner.indexOf('grunt') != -1 && this.taskRunner.indexOf('gulp') == -1) {
			this.template(this.generatorGruntPath + '_clean.js.ejs', this.gruntPath + 'clean.js');
			this.template(this.generatorGruntPath + '_sass.js.ejs', this.gruntPath + 'sass.js');
			this.template(this.generatorGruntPath + '_sassGlobber.js.ejs', this.gruntPath + 'sassGlobber.js');
			this.template(this.generatorGruntPath + '_concurrent.js.ejs', this.gruntPath + 'concurrent.js');
			this.template(this.generatorGruntPath + 'express.js', this.gruntPath + 'express.js');
			this.copy(this.generatorGruntPath + 'cssmin.js', this.gruntPath + 'cssmin.js');
			this.template(this.generatorGruntPath + '_sync.js.ejs', this.gruntPath + 'sync.js');
			this.template(this.generatorGruntPath + '_watch.js.ejs', this.gruntPath + 'watch.js');
		}
	}

	if (!this.gruntModules && !this.gruntModules.length) return;

	// Grunt modules are splitted up in separate files and modules
	if (this.gruntModules.indexOf('grunt-accessibility') != -1) {
		this.copy(this.generatorGruntPath + 'accessibility.js', this.gruntPath + 'accessibility.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-accessibility'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-autoprefixer') != -1) {
		this.copy(this.generatorGruntPath + 'autoprefixer.js', this.gruntPath + 'autoprefixer.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-autoprefixer'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-bless') != -1) {
		this.copy(this.generatorGruntPath + 'bless.js', this.gruntPath + 'bless.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-bless'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-browser-sync') != -1) {
		this.template(this.generatorGruntPath + '_browserSync.js.ejs', this.gruntPath + 'browserSync.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-browser-sync'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-browserify') != -1 ||
		this.veamsPackages && this.veamsPackages.length && this.veamsPackages.indexOf('veamsJS') !== -1) {
		this.template(this.generatorGruntPath + '_browserify.js.ejs', this.gruntPath + 'browserify.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-browserify'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-postcss-separator') != -1) {
		this.copy(this.generatorGruntPath + '_postcssSeparator.js.ejs', this.gruntPath + 'postcssSeparator.js');
		if (object.installDeps) {
			this.npmInstall(['grunt-postcss-separator'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-csscomb') != -1) {
		this.copy(this.generatorGruntPath + 'csscomb.js', this.gruntPath + 'csscomb.js');
		this.copy(this.generatorHelperPath + 'task-configs/csscomb.json', this.helperPath + 'task-configs/csscomb.json');

		if (object.installDeps) {
			this.npmInstall(['grunt-csscomb'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-contrib-handlebars') != -1 ||
		this.veamsPackages && this.veamsPackages.length && this.veamsPackages.indexOf('veamsJS') !== -1) {
		this.copy(this.generatorGruntPath + 'handlebars.js', this.gruntPath + 'handlebars.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-contrib-handlebars'], {'saveDev': true});

			this.log(('\n') + chalk.bgRed('lease add the following lines to your Gruntfile.js to your custom tasks: ') + ('\n') +
				chalk.yellow('\n grunt.registerTask(\'jsTemplates\', [') +
				chalk.yellow('\n    \'handlebars\',') +
				chalk.yellow('\n    \'replace:jsTemplates\'' +
					chalk.yellow('\n ]);') + ('\n') + ('\n'))
			);
		}
	}
	if (this.gruntModules.indexOf('grunt-contrib-htmlmin') != -1) {
		this.copy(this.generatorGruntPath + 'htmlmin.js', this.gruntPath + 'htmlmin.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-contrib-htmlmin'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-contrib-requirejs') != -1) {
		this.copy(this.generatorGruntPath + 'requirejs.js', this.gruntPath + 'requirejs.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-contrib-requirejs'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-contrib-uglify') != -1) {
		this.template(this.generatorGruntPath + '_uglify.js.ejs', this.gruntPath + 'uglify.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-contrib-uglify'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-combine-mq') != -1) {
		this.copy(this.generatorGruntPath + 'combine_mq.js', this.gruntPath + 'combine_mq.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-combine-mq'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-dr-svg-sprites') != -1) {
		this.mkdir(this.srcPath + 'scss/icons');
		this.template(this.generatorGruntPath + '_dr-svg-sprites.js.ejs', this.gruntPath + 'dr-svg-sprites.js');
		this.copy(this.generatorHelperPath + 'templates/svg-sprites/stylesheet.hbs', this.helperPath + 'templates/svg-sprites/stylesheet.hbs');

		if (object.installDeps) {
			this.npmInstall(['grunt-dr-svg-sprites'], {'saveDev': true});

			this.log(('\n') + chalk.bgRed('Please add the following line to your Gruntfile.js file in line 22 (require())') + ('\n') +
				chalk.yellow('\n "svg-sprites": "grunt-dr-svg-sprites"') + ('\n') +
				chalk.bgRed('\n Please add the following lines to your Gruntfile.js to your custom tasks:') + ('\n') +
				chalk.yellow('\n grunt.registerTask(\'sprites\', [') +
				chalk.yellow('\n    \'svg-sprites\',') +
				chalk.yellow('\n    \'replace:spriteUrl\'' +
					chalk.yellow('\n ]);') + ('\n') + ('\n'))
			);
		}
	}
	if (this.gruntModules.indexOf('grunt-grunticon') != -1) {
		this.directory(this.generatorSrcPath + 'scss/icons', this.srcPath + 'scss/icons');
		this.directory(this.generatorHelperPath + 'templates/grunticon', this.helperPath + '/templates/grunticon');
		this.template(this.generatorGruntPath + '_grunticon.js.ejs', this.gruntPath + 'grunticon.js');

		if (object.installDeps) {
			this.bowerInstall(['veams-sass'], {'save': true});
			this.npmInstall(['grunt-grunticon'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-image-size-export') != -1) {
		this.copy(this.generatorGruntPath + 'imageSizeExport.js', this.gruntPath + 'imageSizeExport.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-image-size-export'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-includes') != -1) {
		this.copy(this.generatorGruntPath + 'includes.js', this.gruntPath + 'includes.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-includes'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-modernizr') != -1) {
		this.copy(this.generatorGruntPath + 'modernizr.js', this.gruntPath + 'modernizr.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-modernizr'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-phantomas') != -1) {
		this.copy(this.generatorGruntPath + 'phantomas.js', this.gruntPath + 'phantomas.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-phantomas'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-photobox') != -1) {
		this.template(this.generatorGruntPath + 'photobox.js', this.gruntPath + 'photobox.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-photobox'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-responsive-images') != -1) {
		this.copy(this.generatorGruntPath + 'responsive_images.js', this.gruntPath + 'responsive_images.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-responsive-images'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-svgmin') != -1) {
		this.copy(this.generatorGruntPath + 'svgmin.js', this.gruntPath + 'svgmin.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-svgmin'], {'saveDev': true});
		}
	}
	if (this.gruntModules.indexOf('grunt-version') != -1) {
		this.copy(this.generatorGruntPath + 'version.js', this.gruntPath + 'version.js');
		this.copy(this.generatorSrcPath + 'templating/partials/blocks/b-version.hbs', this.srcPath + 'templating/partials/blocks/b-version.hbs');

		if (object.installDeps) {
			this.npmInstall(['grunt-version'], {'saveDev': true});
		}
	}

	if (this.gruntModules.indexOf('grunt-grunticon') != -1 ||
		this.gruntModules.indexOf('grunt-dr-svg-sprites') != -1 ||
		this.gruntModules.indexOf('grunt-contrib-handlebars') != -1 ||
		this.veamsPackages && this.veamsPackages.length && this.veamsPackages.indexOf('veamsJS') !== -1) {
		this.template(this.generatorGruntPath + '_replace.js.ejs', this.gruntPath + 'replace.js');

		if (object.installDeps) {
			this.npmInstall(['grunt-text-replace'], {'saveDev': true});
		}
	}

	if (this.gruntModules.indexOf('grunt-grunticon') != -1 && this.gruntModules.indexOf('grunt-postcss-separator') != -1) {
		this.copy(this.generatorSrcPath + 'js/vendor/loadCSS.js', this.srcPath + 'js/vendor/loadCSS.js');
	}
};