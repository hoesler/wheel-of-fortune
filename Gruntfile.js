module.exports = function(grunt) {

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
				baseUrl: ".",
				dir: "build",
				modules: [
				{
					name: "scripts/main",
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
						underscore: '../bower_components/underscore/underscore',
						quint: "../bower_components/qunit/qunit/qunit",
						backbone: "../bower_components/backbone/backbone",
						palette: 'scripts/vendor/palette'
				}
			},
			production: {},
			development: {
				options: {
					optimize: "none"
				}
			}
		},
		connect: {
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

	grunt.registerTask('test', ['jshint:source', 'jshint:test', 'qunit:all']);
	grunt.registerTask('build:development', ['test', 'requirejs:development']);
	grunt.registerTask('build:production', ['test', 'requirejs:production']);
	grunt.registerTask('build', ['build:development']);
	grunt.registerTask('deploy', ['build:production', 'rsync:production']);
	grunt.registerTask('server', ['connect:build:keepalive']);
};
