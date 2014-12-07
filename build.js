({
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

	    palette: 'scripts/vendor/palette'
    }
})