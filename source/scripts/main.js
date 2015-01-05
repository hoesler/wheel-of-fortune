require(["backbone", "scripts/router/app"],
	function(Backbone, App) {
		var app = new App();
		Backbone.history.start({pushState: true});
	}
);