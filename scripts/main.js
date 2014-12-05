require(["jquery", "chance", "moment", "palette", "jquery.easing", "underscore"], function(jquery, Chance, moment, palette, easing, underscore) {
	Math.TWO_PI = 2 * Math.PI;
	Math.sum = function(a, b) {
		return a + b;
	};

	/**
	 * Plot the wheel of fortune
	 * @param {Array} arc_widths - The arc widths
	 * @param {Array} labels - The arc labels
	 * @param {Array} colors - The arc colors
	 * @param {Canvas} canvas - The canvas to plot on
	 * @param {number} rotation - The rotation of the wheel in radians
	 */
	function plot_wheel(arc_widths, labels, colors, canvas, rotation) {
		rotation = typeof rotation !== 'undefined' ? rotation : 0;

		var canvas;
		var ctx;
		var acr_start = 0;
		var radius = 200;
		var wheel_center_x = 200;
		var wheel_center_y = 200;

		ctx = canvas.getContext("2d");
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.translate(wheel_center_x, wheel_center_y);
		ctx.rotate(rotation);
		ctx.translate(-wheel_center_x, -wheel_center_y);

		for (var i = 0; i < arc_widths.length; i++) {
			ctx.fillStyle = "#" + colors[i];
			ctx.beginPath();
			ctx.moveTo(wheel_center_x, wheel_center_y);
			var arc_end = acr_start + arc_widths[i];
			ctx.arc(wheel_center_x, wheel_center_y, radius, acr_start, arc_end, false);
			ctx.lineTo(wheel_center_x, wheel_center_y);
			ctx.fill();
			
			ctx.save();
			var adjacent = Math.cos(acr_start + (arc_end - acr_start) / 2) * (radius - 10);
			var opposite = Math.sin(acr_start + (arc_end - acr_start) / 2) * (radius - 10);
			ctx.translate(wheel_center_x + adjacent, wheel_center_y + opposite);
			ctx.rotate(acr_start + (arc_end - acr_start) / 2);
		
			ctx.fillStyle = "#000000";
			ctx.textAlign = "right"; 
			ctx.textBaseline = "middle";
			ctx.fillText(labels[i], 0, 0);

			ctx.restore();

			acr_start = arc_end;
		}
		ctx.restore();

		ctx.beginPath();
	    ctx.moveTo(wheel_center_x + radius - 5, wheel_center_y);
	    ctx.lineTo(wheel_center_x + radius + 50, wheel_center_y);
	    ctx.stroke();
	}

	/**
	 * Initialize the Wheel
	 * @param {Array} locations - An array of objects which have a fitness and location property
	 * @param {number} index - The index if the location to stop rotation on
	 * @param {jQuery.fn.init} canvas - The canvas element in the DOM slected using $()
	 */
	function init_wheel(locations, index, canvas_el) {
		var values = _.map( locations, function( val ) {
				return val.fitness;
			});
		var labels = _.map( locations, function( val ) {
				return val.location;
			});
		var colors = palette(['tol-rainbow'], locations.length);

		var animation_duration = 10000; // in ms
		var values_sum = _.reduce(values, Math.sum, 0);
		var arc_widths = _.map(values, function(value) { return Math.TWO_PI * (value / values_sum); });

		var partial_exclusive = _.reduce(arc_widths.slice(0, index), Math.sum, 0);
		var partial_inclusive = partial_exclusive + arc_widths[index];
		var angle_selected = partial_exclusive + (partial_inclusive - partial_exclusive) / 2;

		var rotation_max = Math.TWO_PI * 10 + (Math.TWO_PI - angle_selected);

		plot_wheel(arc_widths, labels, colors, canvas_el.get(0), 0);
		canvas_el.addClass("clickable");

		canvas_el.on( "click", function() {
			var el = $(this);
			if (!el.hasClass("clickable")) {
				return;
			}
			el.removeClass("clickable");
			var animation_start = moment();
			var animation_interval = setInterval(function() {
				var time = moment().diff(animation_start);
				var easing = jQuery.easing.easeOutCirc(null, time, 0, rotation_max, animation_duration);
				var rotation = easing % Math.TWO_PI;
				plot_wheel(arc_widths, labels, colors, canvas_el.get(0), rotation);
			}, 10);

			setTimeout(function() {
				clearInterval(animation_interval);
				el.addClass("clickable");
			}, animation_duration);
		});
	}

	/**
	 * Roulette Wheel selection
	 * @param {Array} fitness - The fitness values.
	 * @param {Chance} chance - The rng to use.
	 */
	function roulette_wheel_selection(fitness, chance) {
		chance = typeof chance !== 'undefined' ? chance : new Chance();
		var rand = chance.integer({min: 1, max: _.reduce(fitness, Math.sum, 0)});
		var tmp = 0;
		var selected_index = -1;
		for (i = 0; i < fitness.length; i++) {
			tmp += fitness[i]
			if (tmp >= rand) {
				selected_index = i;
				break
			}
		}
		return selected_index;
	}

	// Init canvas
	var canvas_el = $("#canvas");
	var canvas = canvas_el.get(0);
	var ctx = canvas.getContext("2d");
	ctx.textAlign="center"; 
	ctx.fillText("loading data...", canvas.width / 2, canvas.height / 2); 

	// Load data and init wheel	
	var spreadsheet_url = "https://spreadsheets.google.com/feeds/list/***REMOVED***/1/public/values?alt=json&amp;callback=importGSS";
	var label_key = "ort";
	var fitness_key = "haeufigkeit";

	$.getJSON(spreadsheet_url, function( data ) {
		var locations = []
		var sum = 0
		_.each(data.feed.entry, function(element) {
			var location = element["gsx$" + label_key].$t
			var fitness = parseInt(element["gsx$" + fitness_key].$t)
			if (fitness > 0) {
				locations.push({location: location, fitness: fitness});
				sum += fitness;
			}
		});
		locations = new Chance(33).shuffle(locations); // fixed shuffle

		var chance = new Chance(moment().dayOfYear());
		var chosen_location = roulette_wheel_selection(_.map(locations, function(e) { return e.fitness; }), chance);

		init_wheel(locations, chosen_location, canvas_el);

	}).fail(function() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.textAlign = "center"; 
		ctx.fillText("data could not be loaded", canvas.width / 2, canvas.height / 2);
	});
	
});