require(["jquery", "chance", "moment", "palette"], function(jquery, chance, moment, palette) {
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

		function getTotal(myData){
			var myTotal = 0;
			for (var j = 0; j < myData.length; j++) {
				myTotal += (typeof myData[j] == 'number') ? myData[j] : 0;
			}
			return myTotal;
		}

		function plotData(myData, myColor, canvas) {
			var canvas;
			var ctx;
			var lastend = 0;
			var myTotal = getTotal(myData);

			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (var i = 0; i < myData.length; i++) {
				ctx.fillStyle = "#" + myColor[i];
				ctx.beginPath();
				ctx.moveTo(200,150);
				ctx.arc(200,150,150,lastend,lastend+
					(Math.PI*2*(myData[i]/myTotal)),false);
				ctx.lineTo(200,150);
				ctx.fill();
				lastend += Math.PI*2*(myData[i]/myTotal);
			}
		}

		var values = $.map( locations, function( val, i ) {
				return val.frequency;
			});
		var colors = palette('sequential', locations.length);
		var canvas = $("#canvas").get(0)
		plotData(values, colors, canvas);
	});
});