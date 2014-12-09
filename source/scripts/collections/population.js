define(["backbone", "underscore"],
	function(Backbone, _) {

	var Population = Backbone.Collection.extend({
		
		model: Individual,

		url: 'https://spreadsheets.google.com/feeds/list/***REMOVED***/1/public/values?alt=json&amp;callback=importGSS',
		
		parse: function(response, options) {
			var label_key = "ort";
			var fitness_key = "haeufigkeit";
			var locations = [];

			var elements = new Chance(33).shuffle(response.feed.entry); // fixed shuffle
			_.each(elements, function(element) {
				var location = element["gsx$" + label_key].$t;
				var fitness = parseInt(element["gsx$" + fitness_key].$t);
				if (fitness > 0) {
					locations.push({label: location, fitness: fitness});
				}
			});

			return locations;
		}
	});

	return Population;
});