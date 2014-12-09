define(["underscore"],
	function(_) {
		Math.TWO_PI = 2 * Math.PI;
		Math.sum = function(a, b) {
			return a + b;
		};

		return {		
			/**
			 * Roulette Wheel selection
			 * @param {Array} fitness - The fitness values.
			 * @param {Object} rng - The rng to use (An object which has a random function, defaults to Math).
			 */
			roulette_wheel_selection: function(fitness, rng) {
				rng = typeof rng !== 'undefined' ? rng : Math;

				var rand = rng.random() * _.reduce(fitness, Math.sum, 0);
				var tmp = 0;
				var selected_index = -1;
				for (i = 0; i < fitness.length; i++) {
					tmp += fitness[i];
					if (rand < tmp) {
						selected_index = i;
						break;
					}
				}
				return selected_index;
			}
		};
	}
);