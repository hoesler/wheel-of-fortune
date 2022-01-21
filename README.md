# Wheel-Of-Fortune

A Javascript application which creates a wheel-of-fortune using HTML5 Canvas.

## Description
This is a personal toy web application created in 2015 to explore [HTML5 Canvas](http://diveintohtml5.info/canvas.html) and the development workflow for a Javascript project which was state of the art at that time. I chose [Backbone](backbonejs.org) as the application framework and [Grunt](http://gruntjs.com/) for task automation. For easy data manipulation, I wanted to load the wheel data from a google spreadsheet using the Google Sheets API.

After 7 year of inactivity, in 2021, I updated the app to use the Goggle Sheets API V4 API. V3 has been deactivated in 2020. Other major changes include a migration from bower to yarn, updated dependencies and support for Hi-DPI displays.

## Demo
[http://zweischrift.de/wof/](http://zweischrift.de/wof/)

## Local Setup
1. Create a a Google spreadsheet with the first column holding the labels and the second the selection weight of each element (see this [example](https://docs.google.com/spreadsheets/d/1gjkTgiAs-SX6Gbf09JvvJajJLSv7IRqLAFpUhhmlSMM/edit?usp=sharing)) and [publish](https://support.google.com/docs/answer/37579?hl=en) it.
2. Clone this repository and rename *Gruntfile.sample.js* as *Gruntfile.js* and edit the *initialRoute* parameter in the *template* task (*\<sheet_id\>* is the key of your spreadsheet as defined by the [Google Sheets API](https://developers.google.com/sheets/api) and *\<api_key\>* an [API key](https://developers.google.com/sheets/api/guides/authorizing#APIKey) which authorizes the requests).
3. Run ```yarn install && yarn exec grunt build server```, which builds the app in the *build/* directory and starts a server at *localhost:7878* with this directory as it's root. Open a browser and enter the URL of the server.
4. Spin the wheel ;)

