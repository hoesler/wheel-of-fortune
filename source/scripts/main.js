require(["jquery", "chance", "moment", "underscore", "palette", "scripts/app/wheel", "scripts/collections/population"],
	function($, Chance, moment, _, palette, Wheel, Population) {
		
		var random = _.constant(new Chance(Math.floor(moment.duration(moment().valueOf()).asDays())).random());

		var population = new Population();
		new Wheel({el: $("#canvas"), collection: population, random: random});

		population.fetch({reset: true});	
});