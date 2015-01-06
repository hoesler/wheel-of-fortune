# Wheel-Of-Fortune

>A Javascript application which creates a wheel-of-fortune using HTML5 Canvas.

## Description
This is a personal toy web application to explore [HTML5 Canvas](http://diveintohtml5.info/canvas.html) and the development workflow for a Javascript project. It utilizes [Backbone](backbonejs.org) as the application framework and [Grunt](http://gruntjs.com/) for task automation.

The current implementation fetches the wheel-data from a [google spreadsheet](https://docs.google.com/spreadsheets) using the [Spreadsheets Data API](https://developers.google.com/gdata/samples/spreadsheet_sample).

## Setup
Create a [spreadsheet](https://docs.google.com/spreadsheets) and [publish](https://support.google.com/docs/answer/37579?hl=en) it.

Rename the file *Gruntfile.sample.js* to *Gruntfile.js* and edit at least the *initialRoute* setting  in the *template* task. *\<key\>* is the key of your spreadsheet as defined by the [Spreadsheets Data API](https://developers.google.com/gdata/samples/spreadsheet_sample). *\<label column title\>* and *\<fitness column title\>* are the values in the columns of the first row in the spreadsheet.

Run ```grunt build server``` which builds the app in the *build/* directory and starts a server at *localhost:7878* with this directory as it's root. Last, open a browser and enter the URL of the server.

Spin the wheel ;)