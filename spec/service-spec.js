var moment = require('moment');

var PortfolioChartService = require('../portfolio-chart-service');
var DataPoint = require('../data-point');

describe('PortfolioChartService()', function () {

    it('sortTransactions - no transactions', function () {

        //Given:
        var service = new PortfolioChartService()

        //When: 
        var transactions = service.sortTransactions([]);

        //Then:
        expect(transactions).toEqual([]);

    });

    it('sortTransactions - 2 transactions', function () {

        //Given:
        var service = new PortfolioChartService()
        var t1 = { date: '2018-01-01' }
        var t2 = { date: '2018-06-01' }
        var t3 = { date: '2018-03-01' }

        //When: 
        var transactions = service.sortTransactions([t3, t2, t1]);

        //Then:
        expect(transactions).toEqual([t1, t3, t2]);

    });

    it('getLimit - 1 transaction, days', function () {

        //Given:
        var service = new PortfolioChartService()
        var t1 = { date: moment().subtract(30, 'days').toDate() }

        //When: 
        var limit = service.getLimit([t1], 'days');

        //Then:
        expect(limit).toBe(30);

    });

    it('getLimit - 1 transaction, hours', function () {

        //Given:
        var service = new PortfolioChartService()
        var t1 = { date: moment().startOf('day').subtract(700, 'hours').toDate() }

        //When: 
        var limit = service.getLimit([t1], 'hours');

        //Then:
        expect(limit).toBe(700);

    });

    it('getLimit - 2 transaction, days', function () {

        //Given:
        var service = new PortfolioChartService()

        //Transactions must be sorted already
        var t1 = { date: moment().subtract(90, 'days').toDate() }
        var t2 = { date: moment().subtract(60, 'days').toDate() }
        

        //When: 
        var limit = service.getLimit([t1, t2], 'days');

        //Then:
        expect(limit).toBe(90);

    });

    it('getUniqueCurrencies - 3 transaction', function () {

        //Given:
        var service = new PortfolioChartService()

        var t1 = { currency: 'BTC' };
        var t2 = { currency: 'ETH' };
        var t3 = { currency: 'BTC' };
        

        //When: 
        var currencies = service.getUniqueCurrencies([t1, t2, t3]);

        //Then:
        expect(currencies).toEqual(['BTC', 'ETH']);

    });

    it('getInitialsedDataPoints - 3 data points', function () {

        //Given:
        var service = new PortfolioChartService()

        //When: 
        var dataPoints = service.getInitialsedDataPoints(3, 'hours');

        //Then:
        var arr = [];
        for (var k in dataPoints) {
            if (dataPoints.hasOwnProperty(k)) {
                arr.push(dataPoints[k]);
            }
        }

        expect(arr.length).toBe(3);
        expect(arr[0]).toEqual(jasmine.any(DataPoint));
    });

    it('getSelfReferenceDailyData - 3 data points', function () {

        //Given:
        var service = new PortfolioChartService()
        var dataPoints = [];
        dataPoints['1'] = new DataPoint();
        dataPoints['2'] = new DataPoint();

        //When: 
        var dailyData = service.getSelfReferenceDailyData(dataPoints);

        //Then:
        expect(dailyData).toEqual([{ time: '1', close: 1 }, { time: '2', close: 1 }]);
    });

    it('getTransactions - 4 transactions, 2 returned', function () {

        //Given:
        var service = new PortfolioChartService()
        var t1 = { currency: 'BTC', date: moment().subtract(5, 'day') }; 
        var t2 = { currency: 'ETH', date: moment().subtract(5, 'day') };
        var t3 = { currency: 'BTC', date: moment().subtract(3, 'day') };
        var t4 = { currency: 'BTC', date: moment().subtract(1, 'day') };

        //When: 
        var transactions = service.getTransactions([t1, t2, t3, t4], moment().subtract(2, 'day'), 'BTC');

        //Then:
        expect(transactions).toEqual([t1, t3]);
    });

    it('getSales - 4 sales, 2 returned', function () {

        //Given:
        var service = new PortfolioChartService()

        var s1 = { date: moment().subtract(5, 'day') }; 
        var s2 = { date: moment().subtract(5, 'day') };
        var s3 = { date: moment().subtract(3, 'day') };
        var s4 = { date: moment().subtract(1, 'day') };

        var t1 = { currency: 'BTC', sales: [s1] }; 
        var t2 = { currency: 'ETH', sales: [s2] };
        var t3 = { currency: 'BTC', sales: [s3, s4] };

        //When: 
        var sales = service.getSales([t1, t2, t3], moment().subtract(2, 'day'), 'BTC');

        //Then:
        expect(sales).toEqual([s1, s3]);
    });

    // it('loadDataPointsForDailyData - 1 transaction', function () {

    //     //Given:
    //     var service = new PortfolioChartService()

    //     var dailyData = [];
    //     var transactions = [];

    //     var dataPoints = service.getInitialsedDataPoints(1, 'days');

    //     for (let time in dataPoints) {
    //         if (dataPoints.hasOwnProperty(time)) {
    //             dailyData.push({ time: time, close: 100 });
    //             transactions.push({ currency: 'BTC', amount: 2, date: moment().subtract(2, 'days').toDate(), sales: [] });
    //         }
    //     }

    //     //When: 
    //     service.loadDataPointsForDailyData(dataPoints, transactions, 'BTC', dailyData);

    //     //Then:
    //     expect(dataPoints[dailyData[0].time].getTotal()).toEqual(200);
    // });

    it('getData - no transactions', function (done) {

        //Given:
        var service = new PortfolioChartService()

        //When: 
        var promise = service.getData([]);

        //Then:
        promise.then(data => {
            expect(data.labels).toEqual([]);
            expect(data.datasets).toEqual([]);
            done();
        })

    });

    it('getData - intergration test', function (done) {

        //Given:
        var service = new PortfolioChartService();

        var t1 = moment().utc().subtract(2, 'days').startOf('day').unix();
        var t2 = moment().utc().subtract(1, 'days').startOf('day').unix();
        var t3 = moment().utc().subtract(0, 'days').startOf('day').unix();

        var dailyDataUSD = JSON.parse(`[
            {"time":${t1},"close":9655.77},
            {"time":${t2},"close":8873.62},
            {"time":${t3},"close":8865.7}]`);

        var apis = {
            daily: function() {
                return new Promise((resolve, reject) => {
                    resolve(dailyDataUSD);
                });
            }
        }

        var t1 = { date: moment().utc().subtract(3, 'days').toISOString(), currency: 'BTC', amount: 1, sales: [] };

        //When: 
        var promise = service.getData([t1], 'USD', 'BTC', 3, 2, apis);

        //Then:
        promise.then(dataPoints => {
            
            var dataPoints1 = dataPoints[0];
            expect(dataPoints1[t3].getTotal()).toEqual(8865.7);

            var dataPoints2 = dataPoints[1];
            expect(dataPoints2[t2].getTotal()).toEqual(1);

            done();
        })

    });
});