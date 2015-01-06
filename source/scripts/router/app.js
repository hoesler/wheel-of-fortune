define(["backbone", "jquery", "chance", "moment", "underscore", "palette", "scripts/views/wheel", "scripts/collections/population"],
	function(Backbone, $, Chance, moment, _, palette, Wheel, Population) {
		
		var App = Backbone.Router.extend({

		  routes: {
		    "wheel/*options": "wheel"
		  },

		  /**
		   * @param options String - String of the form [key:value[;key:value...]]
		   */
		  wheel: function(options) {
		  	var wheel_config = _.transform(options.split(';'), function(result, el, index) {
		  		var pair = el.split(':');
		  		var key = _.first(pair);
		  		var value = _.last(pair);
		  		result[key] = value;
		  	});
		  	
		  	if (wheel_config.random === undefined) {
		  		wheel_config.random = 'random';
		  	}

		  	var rng = null;
		  	if (wheel_config.random == "date") {
	  			rng = _.constant(new Chance(Math.floor(moment.duration(moment().valueOf()).asDays())).random());
	  		} else {
	  			chance = new Chance();
	  			rng = function() { return chance.random(); };
	  		}

		  	if (wheel_config.color_scheme === undefined) {
		  		wheel_config.color_scheme = 'tol-rainbow';
		  	}

  			var color_brewer = function(number) { return palette([wheel_config.color_scheme], number); };

  			if (wheel_config.data === undefined) {
  				// TODO: error
  			}

  			var population = null;
  			if (/^spreadsheet/.test(wheel_config.data)) {
  				var spreadsheet_options = /^spreadsheet,([^,]+),([^,]+),([^,]+)/.exec(wheel_config.data);
  				var spreadsheet_id = spreadsheet_options[1];
  				var label_key = spreadsheet_options[2];
  				var fitness_key = spreadsheet_options[3];
  				population = new Population([], {
					url: 'https://spreadsheets.google.com/feeds/list/' + spreadsheet_id + '/1/public/values?alt=json&amp;callback=importGSS',
					label_key: label_key,
					fitness_key: fitness_key
				});
  			} else {
  				// TODO: error
  			}
			
			var canvas = $("#canvas");

			var wheel = new Wheel({
				el: canvas,
				collection: population,
				random: rng,
				color_brewer: color_brewer
			});

			wheel.populate();
		  }
		});	

		return App;
	}
);