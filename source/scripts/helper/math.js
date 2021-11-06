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
             * @param {Object} random - The random function to use. Must return a value in [0,1).
             */
            roulette_wheel_selection: function(fitness, random) {
                random = typeof random !== 'undefined' ? random : Math.random;

                var rand = random() * _.reduce(fitness, Math.sum, 0);
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