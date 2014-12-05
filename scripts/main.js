require(["jquery", "chance", "moment", "palette", "jquery.easing"], function(jquery, Chance, moment, palette) {
	spreadsheet_url = "https://spreadsheets.google.com/feeds/list/***REMOVED***/1/public/values?alt=json&amp;callback=importGSS";

	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext("2d");
	ctx.textAlign="center"; 
	ctx.fillText("loading data...", canvas.width / 2, canvas.height / 2); 

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

		locations = new Chance(33).shuffle(locations); // fixed shuffle

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

		function angle_chosen(values, index) {
			if (index > values.length) {
				throw new Error("Index out of bounds");
			}
			var total = getTotal(values);
			var partial_exclusive = getTotal(values.slice(0, index));
			var partial_inclusive = partial_exclusive + values[index];

			var angle = (partial_exclusive + (partial_inclusive - partial_exclusive) / 2) / total * Math.PI * 2;

			return angle;
		}

		function plotData(myData, text, myColor, canvas, rotation) {
			rotation = typeof rotation !== 'undefined' ? rotation : 0;

			var canvas;
			var ctx;
			var acr_start = 0;
			var myTotal = getTotal(myData);
			var radius = 200;
			var wheel_center_x = 200;
			var wheel_center_y = 200;

			ctx = canvas.getContext("2d");
			ctx.save();
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.translate(wheel_center_x, wheel_center_y);
			ctx.rotate(rotation);
			ctx.translate(-wheel_center_x, -wheel_center_y);

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
			
				ctx.fillStyle = "#000000";
				ctx.textAlign="right"; 
				ctx.textBaseline="middle";
				ctx.fillText(text[i], 0, 0);

				ctx.restore();

				acr_start = arc_end;
			}
			ctx.restore();

			ctx.beginPath();
		    ctx.moveTo(wheel_center_x + radius - 5, wheel_center_y);
		    ctx.lineTo(wheel_center_x + radius + 50, wheel_center_y);
		    ctx.stroke();
		}

		var values = $.map( locations, function( val, i ) {
				return val.frequency;
			});
		var text = $.map( locations, function( val, i ) {
				return val.location;
			});
		var colors = palette(['tol-rainbow'], locations.length);
		var canvas = $("#canvas").get(0)

		var animation_duration = 10000; // in ms
		var TWO_PI = 2 * Math.PI;
		var rotation_max = TWO_PI * 10 + (TWO_PI - angle_chosen(values, chosen_location));

		plotData(values, text, colors, canvas, 0);

		$("#canvas").on( "click", function() {
			var el = $(this);
			if (!el.hasClass("clickable")) {
				return;
			}
			el.removeClass("clickable");
			var animation_start = moment();
			var animation_interval = setInterval(function() {
				var time = moment().diff(animation_start);
				var easing = jQuery.easing.easeOutCirc(null, time, 0, rotation_max, animation_duration);
				var rotation = easing % TWO_PI;
				plotData(values, text, colors, canvas, rotation);
			}, 10);

			setTimeout(function() {
				clearInterval(animation_interval);
				el.addClass("clickable");
			}, animation_duration);
		});
	}).fail(function() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.textAlign="center"; 
		ctx.fillText("data could not be loaded", canvas.width / 2, canvas.height / 2);
	});
});