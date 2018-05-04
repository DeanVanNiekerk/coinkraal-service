
var ChartJsService = require('./chartjs-service');
var UtilityService = require('../utility/utility-service');

describe('ChartJsService()', function () {

    it('getLineChartJsDataset - base settings', function () {

        //Given:
        var service = new ChartJsService();
        var data = { "prop1": "val1" };
        var label = { "prop2": "val2" };
        var borderColor = "red";
        var yAxisId = "123X";

        //When: 
        var dataset = service.getLineChartJsDataset(data, label, borderColor, yAxisId);

        //Then:
        expect(dataset.data).toEqual(data);
        expect(dataset.label).toEqual(label);
        expect(dataset.yAxisID).toEqual(yAxisId);
        expect(dataset.borderColor).toEqual(borderColor);
    });

});