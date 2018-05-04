
var CoinRiskChartService = require('./coin-risk-chart-service');

describe('CoinRiskChartService()', function () {

    it('loadDataPoints - no transaction summaries', function () {

        //Given:
        var service = new CoinRiskChartService()

        //When: 
        var datapoints = service.loadDataPoints([]);

        //Then:
        expect(datapoints).toEqual([]);

    });

    it('loadDataPoints - 2 transaction summaries', function () {

        //Given:
        var service = new CoinRiskChartService()
        var ts = [
            { currency: 'ETH', btcValue: 1 },
            { currency: 'NEO', btcValue: 2 }
        ]

        //When: 
        var datapoints = service.loadDataPoints(ts);

        //Then:
        expect(datapoints).toEqual([
            { label: 'ETH', value: 1 },
            { label: 'NEO', value: 2 }
        ]);

    });


    it('reduceDataPoints - 1 data point', function () {

        //Given:
        var service = new CoinRiskChartService()
        var dps = [
            { label: 'ETH', value: 1 }
        ]

        //When: 
        var datapoints = service.reduceDataPoints(dps);

        //Then:
        expect(datapoints).toEqual([
            { label: 'ETH', value: 1 }
        ]);

    });


    it('reduceDataPoints - more than six', function () {

        //Given:
        var service = new CoinRiskChartService()
        var dps = [
            { label: 'ETH', value: 40 },
            { label: 'BTC', value: 30 },
            { label: 'NEO', value: 20 },
            { label: 'WAN', value: 10 },
            { label: 'TAU', value: 8 },
            { label: 'XRP', value: 7 },
            { label: 'ICX', value: 6 },
            { label: 'ADA', value: 5 }
        ]

        //When: 
        var datapoints = service.reduceDataPoints(dps);

        //Then:
        expect(datapoints).toEqual([
            { label: 'ETH', value: 40 },
            { label: 'BTC', value: 30 },
            { label: 'NEO', value: 20 },
            { label: 'WAN', value: 10 },
            { label: 'TAU', value: 8 },
            { label: 'Others', value: 18 }
        ]);

    });


    it('convertToPercentage - six datapoints', function () {

        //Given:
        var service = new CoinRiskChartService()
        var dps = [
            { label: 'ETH', value: 40 },
            { label: 'BTC', value: 30 },
            { label: 'NEO', value: 20 },
            { label: 'WAN', value: 10 },
            { label: 'TAU', value: 8 },
            { label: 'Others', value: 18 }
        ]

        //When: 
        var datapoints = service.convertToPercentage(dps);

        //Then:
        expect(datapoints).toEqual([
            { label: 'ETH', value: 32 },
            { label: 'BTC', value: 24 },
            { label: 'NEO', value: 16 },
            { label: 'WAN', value: 8 },
            { label: 'TAU', value: 6 },
            { label: 'Others', value: 14 }
        ]);

    });


    it('getData - integration', function (done) {

        //Given:
        var service = new CoinRiskChartService()
        var ts = [
            { currency: 'ETH', btcValue: 1 },
            { currency: 'NEO', btcValue: 2 }
        ]

        //When: 
        service.getData(ts)
            .then((dataPoints) => {

                //Then:
                expect(dataPoints).toEqual([
                    { label: 'ETH', value: 33 },
                    { label: 'NEO', value: 67 }
                ]);

                done();

            });
    });

});