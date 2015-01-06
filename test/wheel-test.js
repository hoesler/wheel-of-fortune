define(["../source/scripts/views/wheel", "backbone"], function(Wheel, Backbone) {
	QUnit.module("wheel.js");

	QUnit.test("Wheel construction", function( assert ) {
		var fixture = $( "#qunit-fixture" );
 		fixture.append( "<div id='wheel'><canvas></canvas></div>" );

		var wheel = new Wheel({
			el: $("#wheel"),
			collection: new Backbone.Collection([
				{label: "Tim", fitness: 5},
	  			{label: "Ida", fitness: 26},
	 	 		{label: "Rob", fitness: 55}
	  		])
		});
	 	assert.ok(wheel instanceof Wheel, "We expect wheel to be a Wheel, was " + wheel);
	});

	return QUnit;
});