define(["backbone", "underscore", "scripts/models/wheel_element", "chance"],
    function(Backbone, _, WheelElement, Chance) {

        var GoogleSheetsV4WheelCollection = Backbone.Collection.extend({

            model: WheelElement,

            initialize: function(models, options) {
                this.url = 'https://sheets.googleapis.com/v4/spreadsheets/' + options.spreadsheet_id + '/values/Sheet1?key=' + options.api_key;
            },

            parse: function(response, options) {
                var models = [];

                var elements = new Chance(33).shuffle(response.values); // fixed shuffle
                _.each(elements, function(element) {
                    var label = element[0];
                    var fitness = parseInt(element[1]);
                    if (fitness > 0) {
                        models.push({
                            label: label,
                            fitness: fitness
                        });
                    }
                }, this);

                return models;
            }
        });

        return GoogleSheetsV4WheelCollection;
    });