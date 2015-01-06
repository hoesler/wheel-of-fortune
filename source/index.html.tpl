<!DOCTYPE html>
<html>
<head>
	<title><%- appTitle %></title>
	
	<link rel="stylesheet" type="text/css" href="<%- baseUrl %>style/style.css">

	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<div id="content">

	<canvas id="canvas" width="320" height="320">
	:( Your browser does not support HTML5 Canvas
	</canvas>

	<div id="canvas-label">Click wheel to spin</div>
</div>

</body>
<script src="<%- baseUrl %>scripts/router/app.js"></script>
<script type="text/javascript">
	require(["backbone", "scripts/router/app"],
		function(Backbone, App) {
			var app = new App();
			app.route('', 'init', function() {
				app.navigate("<%- initialRoute %>", {trigger: true});
			});
			Backbone.history.start({pushState: true});	
		}
	);
</script>
</html>