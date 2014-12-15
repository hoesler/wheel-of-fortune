define(["jquery", "moment", "jquery.easing", "underscore", "scripts/helper/math"],
	function($, moment, jquery_easing, _, math) {	

	/**
	 * @param {jQuery.fn.init} canvas_el - The canvas element in the DOM slected using $().
	 * @param {Array} arc_widths - An array of values that define the sizes of the wheel arcs.
	 * @param {Array} labels - An array of values that define the labels of the wheel arcs.
	 * @param {Array} colors - An array of values that define the colors of the wheel arcs.
	 * @param {Function} random - The random function to use for RWS.
	 */
	var Wheel = function(canvas_el, arc_widths, labels, colors, random) {
		this.canvas_el = canvas_el;
		var sum = _.reduce(arc_widths, Math.sum, 0);
		this.arc_widths = _.map(arc_widths, function(width) { return width / sum * Math.TWO_PI; });
		this.labels = labels;
		this.colors = colors;
		this.animation_duration = 10000; // in ms
		this.random = typeof random !== 'undefined' ? random : Math.random;
	};

	/**
	 * Render the wheel
	 */
	Wheel.prototype.render = function(rotation) {
		rotation = typeof rotation !== 'undefined' ? rotation : 0;

		var canvas = this.canvas_el.get(0);
		var acr_start = 0;
		var radius = 200;
		var wheel_center_x = 200;
		var wheel_center_y = 200;

		var ctx = canvas.getContext("2d");
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.translate(wheel_center_x, wheel_center_y);
		ctx.rotate(rotation);
		ctx.translate(-wheel_center_x, -wheel_center_y);

		for (var i = 0; i < this.arc_widths.length; i++) {
			ctx.fillStyle = "#" + this.colors[i];
			ctx.beginPath();
			ctx.moveTo(wheel_center_x, wheel_center_y);
			var arc_end = acr_start + this.arc_widths[i];
			ctx.arc(wheel_center_x, wheel_center_y, radius, acr_start, arc_end, false);
			ctx.lineTo(wheel_center_x, wheel_center_y);
			ctx.fill();
			
			ctx.save();
			var adjacent = Math.cos(acr_start + (arc_end - acr_start) / 2) * (radius - 10);
			var opposite = Math.sin(acr_start + (arc_end - acr_start) / 2) * (radius - 10);
			ctx.translate(wheel_center_x + adjacent, wheel_center_y + opposite);
			ctx.rotate(acr_start + (arc_end - acr_start) / 2);
		
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "right"; 
			ctx.textBaseline = "middle";
			ctx.fillText(this.labels[i], 0, 0);

			ctx.restore();

			acr_start = arc_end;
		}
		ctx.restore();

		ctx.beginPath();
	    ctx.moveTo(wheel_center_x + radius - 5, wheel_center_y);
	    ctx.strokeStyle = '#ffffff';
	    ctx.lineWidth = 3;
	    ctx.lineTo(wheel_center_x + radius + 50, wheel_center_y);
	    ctx.stroke();
	};

	/**
	 * Spin the wheel
	 * @param {Function} after - A callback which gets called at the end of the animation
	 */
	Wheel.prototype.spin = function(after) {
		after = typeof after !== 'undefined' ? after : _.noop();

		var self = this;

		var index = math.roulette_wheel_selection(self.arc_widths, self.random);
		var partial_exclusive = _.reduce(self.arc_widths.slice(0, index), Math.sum, 0);
		var partial_inclusive = partial_exclusive + self.arc_widths[index];
		var angle_selected = partial_exclusive + (partial_inclusive - partial_exclusive) / 2;
		var rotation_max = Math.TWO_PI * 10 + (Math.TWO_PI - angle_selected);

		var animation_start = moment();
		var animation_interval = setInterval(function() {
			var time = moment().diff(animation_start);
			var easing = $.easing.easeOutCirc(null, time, 0, rotation_max, self.animation_duration);
			var rotation = easing % Math.TWO_PI;
			self.render(rotation);
		}, 10);

		setTimeout(function() {
			clearInterval(animation_interval);
			after();
		}, self.animation_duration);
	}

	/**
	 * Setup the Wheel View
	 */
	Wheel.prototype.init = function() {
		var self = this;

		self.render(0);
		this.canvas_el.addClass("clickable");

		this.canvas_el.on( "click", function() {
			var el = $(this);
			if (!el.hasClass("clickable")) {
				return;
			}
			el.removeClass("clickable");

			self.spin(function() {
				el.addClass("clickable");
			});
		});
	};	

	return Wheel;
});