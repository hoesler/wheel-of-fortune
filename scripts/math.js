define(["chance", "underscore"],
	function(Chance, _) {
		Math.TWO_PI = 2 * Math.PI;
		Math.sum = function(a, b) {
			return a + b;
		};

		return {		
			/**
			 * Roulette Wheel selection
			 * @param {Array} fitness - The fitness values.
			 * @param {Chance} chance - The rng to use.
			 */
			roulette_wheel_selection: function(fitness, chance) {
				chance = typeof chance !== 'undefined' ? chance : new Chance();

				var rand = chance.integer({min: 1, max: _.reduce(fitness, Math.sum, 0)});
				var tmp = 0;
				var selected_index = -1;
				for (i = 0; i < fitness.length; i++) {
					tmp += fitness[i]
					if (tmp >= rand) {
						selected_index = i;
						break;
					}
				}
				return selected_index;
			}
		}
	}
);