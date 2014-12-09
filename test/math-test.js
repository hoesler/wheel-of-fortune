require(["../source/scripts/helper/math"], function(math) {
	QUnit.module("math.js");
	
	QUnit.test("roulette_wheel_selection", function( assert ) {
		var index = math.roulette_wheel_selection([0.1, 0.1, 0.1], {random: function() { return 0.4; }});
	 	assert.ok(index == 1, "We expect index to be == 1, was " + index);
	});
});