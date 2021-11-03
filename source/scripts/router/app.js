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
	  		} else if (/^\d+(\.\d+)?$/.test(wheel_config.random)) {
	  			var const_random = parseFloat(wheel_config.random);
	  			// TODO: verify const_random
	  			rng = _.constant(const_random);
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
  			if (/^google_sheet/.test(wheel_config.data)) {
  				var spreadsheet_options = /^google_sheet,(.+)/.exec(wheel_config.data);
  				spreadsheet_options = spreadsheet_options[1].split(/,/).map(s => s.split('='));
				var want = {};
  				spreadsheet_options.forEach(([key, value]) => want[key] = value);

  				var spreadsheet_id = want.id;
  				var api_key = want.key;
  				population = new Population([], {
					url: 'https://sheets.googleapis.com/v4/spreadsheets/' + spreadsheet_id + '/values/Sheet1?key=' + api_key
				});
  			} else {
  				// TODO: error
  			}

			var wheel = new Wheel({
				el: $("#wheel"),
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