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
    jquery: 'bower_components/jquery/dist/jquery.min',
    chance: 'bower_components/chance/chance',
    moment: 'bower_components/momentjs/min/moment.min',
    palette: 'scripts/vendor/palette',
    'jquery.easing': 'bower_components/jquery.easing/js/jquery.easing.min',
    underscore: 'bower_components/underscore/underscore-min'
  },
  packages: [
  ]
});
