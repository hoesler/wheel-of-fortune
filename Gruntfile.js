module.exports = function(grunt) {

	var rewrite = require('connect-modrewrite');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
		source: ['Gruntfile.js', 'source/scripts/{,*/}*.js', '!source/scripts/vendor/**'],
		test: ['test/**/*.js'],
		options: {
		}
	},
	requirejs: {
		options: {
			appDir: "source",
				baseUrl: ".", // relaive to appDir
				dir: "build",
				removeCombined: true,
				modules: [
				{
					name: "scripts/router/app",
					include: "requireLib"
				}
				],
				shim: {
					palette: {
						exports: 'palette'
					},
					'jquery.easing': {
						deps: [
						'jquery'
						]
					}
				},
				paths: {
					requireLib: '../bower_components/requirejs/require',
					jquery: '../bower_components/jquery/dist/jquery',
					chance: '../bower_components/chance/chance',
					moment: '../bower_components/momentjs/moment',
					'jquery.easing': '../bower_components/jquery.easing/js/jquery.easing',
					underscore: '../bower_components/lodash/dist/lodash',
					backbone: '../bower_components/backbone/backbone',
					palette: 'scripts/vendor/palette'
				},
				fileExclusionRegExp: /.*\.(?:tpl|s[ac]ss)/,
			},
			production: {
				options: {
					optimizeCss: "standard",
				}
			},
			development: {
				options: {
					optimize: "none"
				}
			}
		},
		template: {
			options: {
			},
			compile: {
				options: {
					data: {
						appTitle: 'Meal-Wheel of Fortune',
						baseUrl: '/',
						initialRoute: 'spreadsheet/***REMOVED***,ort,haeufigkeit'
					}
				},
				files: {
					'build/index.html': ['source/index.html.tpl']
				}
			}
		},
		compass: {	
			options: {
				sassDir: 'source',
				cssDir: 'build'
			},
			production: {		
				options: {
					environment: 'production'
				}
			},
			development: {
			}
		},
		cssmin: {
			all: {
				files: [{
					expand: true,
					cwd: 'build/style',
					src: ['*.css'],
					dest: 'build/style',
					ext: '.css'
				}]
			}
		},
		connect: {
			options: {
				middleware: function(connect, options, middlewares) {

					var middleware = [];

		            // 1. mod-rewrite behavior
		            var rules = [
		            '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif$ /index.html'
		            ];
		            middleware.push(rewrite(rules));

		            // 2. original middleware behavior
		            var base = options.base;
		            if (!Array.isArray(base)) {
		            	base = [base];
		            }
		            base.forEach(function(path) {
		            	middleware.push(connect.static(path));
		            });

		            return middleware;
		        }
		    },
		    build: {
		    	options: {
		    		hostname: 'localhost',
		    		port: 7878,
		    		base: 'build'
		    	}
		    },
		    test: {
		    	options: {
		    		hostname: 'localhost',
		    		port: 7979,
		    		base: '.'
		    	}
		    }
		},
		rsync: {
			options: {
				args: ["--verbose"],
				recursive: true
			},
			production: {
				options: {
					src: "build/",
					exclude: ["build.txt"],
					dest: "***REMOVED***",
					host: "***REMOVED***",
					deleteAll: true
				}
			}
		},
		qunit: {
			all: ['test/**/*.html']
		}
	});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-requirejs');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-rsync');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.loadNpmTasks('grunt-template');
grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-cssmin');

grunt.registerTask('test', ['jshint:source', 'jshint:test', 'qunit:all']);
grunt.registerTask('build:development', ['test', 'requirejs:development', 'template:compile', 'compass:development']);
grunt.registerTask('build:production', ['test', 'requirejs:production', 'template:compile', 'compass:production', 'cssmin:all']);
grunt.registerTask('build', ['build:development']);
grunt.registerTask('deploy', ['build:production', 'rsync:production']);
grunt.registerTask('server', ['connect:build:keepalive']);
};
