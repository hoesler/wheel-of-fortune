require(["jquery", "chance", "moment"], function(jquery, chance, moment) {
	spreadsheet_url = "https://spreadsheets.google.com/feeds/list/***REMOVED***/1/public/values?alt=json&amp;callback=importGSS";
	
	$.getJSON(spreadsheet_url, function( data ) {
		var locations = []
		var sum = 0
		$.each(data.feed.entry, function(key, val) {
			var location = val.gsx$ort.$t
			var frequency = parseInt(val.gsx$haeufigkeit.$t)
			if (frequency > 0) {
				locations.push({location: location, frequency: frequency})
				sum += frequency
			}
		});


		var chance = new Chance(moment().dayOfYear());
		var rand = chance.integer({min: 1, max: sum});
		var tmp = 0;

		for (i = 0; i < locations.length; i++) {
			tmp += locations[i].frequency
			if (tmp >= rand) {
				$("#where-to-go").text(locations[i].location)
				break
			}
		}
	});
});