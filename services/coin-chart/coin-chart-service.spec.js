var moment = require('moment');

var DataPoint = require('./data-point');
var CoinChartService = require('./coin-chart-service');
var UtilityService = require('../utility/utility-service');

describe('CoinChartService()', function () {

    it('getDataPointsForDailyData - contains 2 daily data items', function () {

        //Given:
        var service = new CoinChartService()

        var t1 = moment().unix();
        var t2 = moment().unix();

        var dailyData = [
            { time: t1, close: 2 },
            { time: t2, close: 1 }
        ]

        //When: 
        var dataPoints = service.getDataPointsForDailyData(dailyData);

        //Then:
        expect(dataPoints.length).toEqual(2);
        expect(dataPoints[0].value).toEqual(2);
        expect(dataPoints[0].date).toEqual(moment.unix(t1));
        expect(dataPoints[1].value).toEqual(1);
        expect(dataPoints[1].date).toEqual(moment.unix(t2));

    });


    it('filterOutEmptyDataPoints - 2 datapoints, 1 empty', function () {

        //Given:
        var service = new CoinChartService()

        var dp1 = new DataPoint(moment());
        dp1.value = null;

        var dp2 = new DataPoint(moment());
        dp2.value = 2;

        //When: 
        var dataPoints = service.filterOutEmptyDataPoints([dp1, dp2], 0);

        //Then:
        expect(dataPoints.length).toEqual(1);
        expect(dataPoints[0].value).toEqual(2);

    });


    it('filterOutEmptyDataPoints - 4 datapoints, 3 empty, min datapoints 2', function () {

        //Given:
        var service = new CoinChartService()

        var dp1 = new DataPoint(moment());
        dp1.value = null;

        var dp2 = new DataPoint(moment());
        dp2.value = null;

        var dp3 = new DataPoint(moment());
        dp3.value = null;

        var dp4 = new DataPoint(moment());
        dp4.value = 2;

        //When: 
        var dataPoints = service.filterOutEmptyDataPoints([dp1, dp2, dp3, dp4], 2);

        //Then:
        expect(dataPoints.length).toEqual(2);
        expect(dataPoints[0].value).toEqual(null);
        expect(dataPoints[1].value).toEqual(2);

    });

    it('getMaxDataPoints - 2 datapoints, 1 empty', function () {

        //Given:
        var service = new CoinChartService()

        var dp1 = new DataPoint(moment());
        dp1.value = null;

        var dp2 = new DataPoint(moment());
        dp2.value = 2;

        //When: 
        var count = service.getMaxDataPoints([dp1, dp2]);

        //Then:
        expect(count).toEqual(1);

    });


    it('getData - integration', function (done) {

        //Given:
        var api = {
            CryptoCompare: {
                getHistoricalPriceByFrequency: () => {
                    return new Promise((resolve, reject) => {
                        resolve(dailyData);
                    });
                }
            }
        }

        var service = new CoinChartService(api);

        var t1 = moment().unix();
        var t2 = moment().unix();

        var dailyData = [
            { time: t1, close: 200 },
            { time: t2, close: 900 }
        ]

        //When: 
        service.getData('ICX', 'BTC', 'USD', 60)
            .then((data) => {

                var dataPoints = data.dataPoints;

                //Then:
                expect(dataPoints.length).toEqual(2);

                expect(dataPoints[0].length).toEqual(2);
                expect(dataPoints[0][0].value).toEqual(200);
                expect(dataPoints[0][1].value).toEqual(900);

                expect(dataPoints[1].length).toEqual(2);
                expect(dataPoints[1][0].value).toEqual(200);
                expect(dataPoints[1][1].value).toEqual(900);

                expect(data.dataFrequency).toEqual('days');

                done();
            });

    });

});