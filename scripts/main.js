require(["jquery", "chance", "moment", "underscore", "palette", "scripts/wheel"],
	function($, Chance, moment, _, palette, Wheel) {
		
	// Init canvas
	var canvas_el = $("#canvas");
	var canvas = canvas_el.get(0);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ffffff";
	ctx.textAlign="center"; 
	ctx.fillText("loading data...", canvas.width / 2, canvas.height / 2); 

	// Load data and init wheel	
	var spreadsheet_url = "https://spreadsheets.google.com/feeds/list/***REMOVED***/1/public/values?alt=json&amp;callback=importGSS";
	var label_key = "ort";
	var fitness_key = "haeufigkeit";

	$.getJSON(spreadsheet_url, function( data ) {
		var values = [];
		var labels = [];

		var elements = new Chance(33).shuffle(data.feed.entry); // fixed shuffle
		_.each(elements, function(element) {
			var location = element["gsx$" + label_key].$t;
			var fitness = parseInt(element["gsx$" + fitness_key].$t);
			if (fitness > 0) {
				values.push(fitness);
				labels.push(location);
			}
		});

		var colors = palette(['tol-rainbow'], values.length);

		var now = moment();
		var fixed_random = new Chance(now.year() * 1000 + now.dayOfYear()).random();
		var chance = new Chance(function() { return fixed_random; });

		new Wheel(canvas_el, values, labels, colors, chance).init();

	}).fail(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = "center"; 
		ctx.fillText("data could not be loaded", canvas.width / 2, canvas.height / 2);
	});
	
});