require(["jquery", "chance", "moment", "underscore", "palette", "scripts/app/wheel", "scripts/collections/population"],
	function($, Chance, moment, _, palette, Wheel, Population) {
		
		var random = _.constant(new Chance(Math.floor(moment.duration(moment().valueOf()).asDays())).random());
		var color_brewer = function(number) { return palette(['tol-rainbow'], number); };

		var population = new Population([], {
			url: 'https://spreadsheets.google.com/feeds/list/***REMOVED***/1/public/values?alt=json&amp;callback=importGSS',
			label_key: 'ort',
			fitness_key: 'haeufigkeit'
		});
		
		var wheel = new Wheel({
			el: $("#canvas"),
			collection: population,
			random: random,
			color_brewer: color_brewer
		});

		wheel.populate();	
});