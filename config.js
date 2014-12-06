require.config({
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
    require: 'bower_components/requirejs/require',
    jquery: 'bower_components/jquery/dist/jquery',
    chance: 'bower_components/chance/chance',
    moment: 'bower_components/momentjs/moment',
    palette: 'scripts/palette',
    'jquery.easing': 'bower_components/jquery.easing/js/jquery.easing',
    underscore: 'bower_components/underscore/underscore'
  },
  packages: [
  ]
});
