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

		var chosen_location = -1;
		for (i = 0; i < locations.length; i++) {
			tmp += locations[i].frequency
			if (tmp >= rand) {
				chosen_location = i;
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

		function plotData(myData, text, myColor, canvas) {
			var canvas;
			var ctx;
			var acr_start = 0;
			var myTotal = getTotal(myData);
			var radius = 200;
			var wheel_center_x = 200;
			var wheel_center_y = 200;

			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (var i = 0; i < myData.length; i++) {
				ctx.fillStyle = "#" + myColor[i];
				ctx.beginPath();
				ctx.moveTo(wheel_center_x, wheel_center_y);
				var arc_end = acr_start + (Math.PI*2*(myData[i]/myTotal))
				ctx.arc(wheel_center_x, wheel_center_y, radius,acr_start,arc_end, false);
				ctx.lineTo(wheel_center_x, wheel_center_y);
				ctx.fill();
				
				ctx.save();
				var adjacent = Math.cos(acr_start + (arc_end - acr_start) / 2) * (radius - 10);
				var opposite = Math.sin(acr_start + (arc_end - acr_start) / 2) * (radius - 10);
				ctx.translate(wheel_center_x + adjacent, wheel_center_y + opposite);
				ctx.rotate(acr_start + (arc_end - acr_start) / 2);
				
				if (chosen_location == i) {
					ctx.fillStyle = "#ffffff";
				} else {
					ctx.fillStyle = "#000000";
				}
			
				ctx.textAlign="right"; 
				ctx.textBaseline="middle";
				ctx.fillText(text[i], 0, 0);

				ctx.restore();

				acr_start = arc_end;
			}
		}

		var values = $.map( locations, function( val, i ) {
				return val.frequency;
			});
		var text = $.map( locations, function( val, i ) {
				return val.location;
			});
		var colors = palette(['tol-rainbow'], locations.length);
		var canvas = $("#canvas").get(0)
		plotData(values, text, colors, canvas);
	});
});