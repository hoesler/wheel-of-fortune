define(["backbone", "underscore", "scripts/models/individual", "chance"],
	function(Backbone, _, Individual, Chance) {

	var Population = Backbone.Collection.extend({
		
		model: Individual,

		initialize: function(models, options) {
			this.url = options.url;
		},
		
		parse: function(response, options) {
			var locations = [];

			var elements = new Chance(33).shuffle(response.values); // fixed shuffle
			_.each(elements, function(element) {
				var location = element[0];
				var fitness = parseInt(element[1]);
				if (fitness > 0) {
					locations.push({label: location, fitness: fitness});
				}
			}, this);

			return locations;
		}
	});

	return Population;
});