
var ChartJsService = require('./chartjs-service');
var UtilityService = require('../utility/utility-service');

describe('ChartJsService()', function () {

    it('getChartJsDataset - base settings', function () {

        //Given:
        var service = new ChartJsService();
        var data = { "prop1": "val1" };
        var label = { "prop2": "val2" };
        var borderColor = "red";
        var yAxisId = "red";

        //When: 
        var dataset = service.getChartJsDataset(data, label, borderColor, yAxisId);

        //Then:
        expect(dataset.data).toEqual(data);
        expect(dataset.label).toEqual(label);
        expect(dataset.yAxisID).toEqual(yAxisId);
        expect(dataset.borderColor).toEqual(borderColor);
    });

});