define(["../source/scripts/helper/math", "underscore"], function(math, _) {
	QUnit.module("math.js");

	QUnit.test("roulette_wheel_selection rand min", function( assert ) {
		var index = math.roulette_wheel_selection([0.1, 0.1, 0.1], _.constant(0));
	 	assert.ok(index === 0, "We expect index to be == 0, was " + index);
	});

	QUnit.test("roulette_wheel_selection rand mid", function( assert ) {
		var index = math.roulette_wheel_selection([0.1, 0.1, 0.1], _.constant(0.4));
	 	assert.ok(index == 1, "We expect index to be == 1, was " + index);
	});

	QUnit.test("roulette_wheel_selection rand max", function( assert ) {
		var index = math.roulette_wheel_selection([0.1, 0.1, 0.1], _.constant(0.999999999));
	 	assert.ok(index == 2, "We expect index to be == 2, was " + index);
	});

	return QUnit;
});