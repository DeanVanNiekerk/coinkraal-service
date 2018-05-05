var moment = require('moment');

var DataPoint = require('./data-point');

class CoinChartService {

    getData(coin, currency1, currency2, timeRange, apis) {

        return new Promise((resolve, reject) => {

            let dataFrequencyLimit = 30;
            let dataFrequency = timeRange <= dataFrequencyLimit ? 'hours' : 'days';

            let limit = timeRange;

            if (dataFrequency == 'hours')
                limit = limit * 24;

            this.loadDataPointsForCurrency(coin, currency1, limit, dataFrequency, apis)
                .then((dataPoints1) => {

                    this.loadDataPointsForCurrency(coin, currency2, limit, dataFrequency, apis)
                        .then((dataPoints2) => {

                            let maxDataPoints1 = this.getMaxDataPoints(dataPoints1);
                            let maxDataPoints2 = this.getMaxDataPoints(dataPoints2);

                            let minDataPoints = maxDataPoints1 > maxDataPoints2 ? maxDataPoints1 : maxDataPoints2;

                            dataPoints1 = this.filterOutEmptyDataPoints(dataPoints1, minDataPoints);
                            dataPoints2 = this.filterOutEmptyDataPoints(dataPoints2, minDataPoints);

                            resolve([
                                dataPoints1,
                                dataPoints2
                            ]);
                        })
                });
        });
    }

    loadDataPointsForCurrency(fromCurrency, toCurrency, limit, dataFrequency, apis) {

        return new Promise((resolve, reject) => {

            if (fromCurrency == toCurrency) {
                resolve([]);
                return;
            }
            else {

                let api = apis.hourly;
                if (dataFrequency == 'days')
                    api = apis.daily;

                api(fromCurrency, toCurrency, limit)
                    .then(dailyData => {
                        let dataPoints = this.getDataPointsForDailyData(dailyData);
                        resolve(dataPoints);
                    })
            }

        });
    }

    getDataPointsForDailyData(dailyData) {

        let dataPoints = []
        dailyData.forEach(d => {
            let date = moment.unix(d.time);
            let dataPoint = new DataPoint(date)
            dataPoint.value = d.close == 0 ? null : d.close;

            dataPoints.push(dataPoint);
        });

        return dataPoints;
    }

    filterOutEmptyDataPoints(dataPoints, minDataPoints) {

        while (dataPoints.length > 0 && dataPoints.length > minDataPoints) {
            if (dataPoints[0].value == null)
                dataPoints.shift();
            else
                return dataPoints;
        }

        return dataPoints;
    }

    getMaxDataPoints(dataPoints) {

        dataPoints = dataPoints.slice(0);

        while (dataPoints.length > 0) {
            if (dataPoints[0].value == null)
                dataPoints.shift();
            else
                return dataPoints.length;
        }

        return dataPoints.length;
    }

}

module.exports = CoinChartService;