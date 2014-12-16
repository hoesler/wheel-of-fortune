define(["backbone", "underscore", "scripts/models/individual"],
	function(Backbone, _, Individual) {

	var Population = Backbone.Collection.extend({
		
		model: Individual,

		initialize: function(models, options) {
			this.url = options.url;
			this.label_key = options.label_key;
			this.fitness_key = options.fitness_key;
		},
		
		parse: function(response, options) {
			var locations = [];

			var elements = new Chance(33).shuffle(response.feed.entry); // fixed shuffle
			_.each(elements, function(element) {
				var location = element["gsx$" + this.label_key].$t;
				var fitness = parseInt(element["gsx$" + this.fitness_key].$t);
				if (fitness > 0) {
					locations.push({label: location, fitness: fitness});
				}
			}, this);

			return locations;
		}
	});

	return Population;
});