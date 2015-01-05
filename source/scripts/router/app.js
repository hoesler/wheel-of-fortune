define(["backbone", "jquery", "chance", "moment", "underscore", "palette", "scripts/views/wheel", "scripts/collections/population"],
	function(Backbone, $, Chance, moment, _, palette, Wheel, Population) {
		
		var App = Backbone.Router.extend({

		  routes: {
		    "(spreadsheet/:spreadsheet_id,:label_key,:fitness_key)": "main"
		  },

		  main: function(spreadsheet_id, label_key, fitness_key) {
  			var random = _.constant(new Chance(Math.floor(moment.duration(moment().valueOf()).asDays())).random());
			var color_brewer = function(number) { return palette(['tol-rainbow'], number); };

			var population = new Population([], {
				url: 'https://spreadsheets.google.com/feeds/list/' + spreadsheet_id + '/1/public/values?alt=json&amp;callback=importGSS',
				label_key: label_key,
				fitness_key: fitness_key
			});
			
			var canvas = $("#canvas");

			var wheel = new Wheel({
				el: canvas,
				collection: population,
				random: random,
				color_brewer: color_brewer
			});

			wheel.populate();
		  }
		});	

		return App;
	}
);