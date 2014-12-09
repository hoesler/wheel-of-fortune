module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
		  // define the files to lint
		all: ['Gruntfile.js', 'source/scripts/{,*/}*.js', '!source/scripts/vendor/**', 'test/**/*.js'],
		  // configure JSHint (documented at http://www.jshint.com/docs/)
		  options: {
		      // more options here if you want to override JSHint defaults
		      globals: {
		      	jQuery: true,
		      	console: true,
		      	module: true
		      }
		  }
		},
		requirejs: {
			compile: {
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

						palette: 'scripts/vendor/palette'
					}
					//,optimize: "none"
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
		        exclude: [".git*","*.scss","node_modules"],
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

	grunt.registerTask('build', ['jshint', 'requirejs']);
	grunt.registerTask('server', ['connect:build:keepalive']);
	grunt.registerTask('deploy', ['rsync:production']);
	grunt.registerTask('test', ['jshint', 'qunit:all']);
};
