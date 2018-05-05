var moment = require('moment');

var DataPoint = require('./data-point');

class PortfolioChartService {

    constructor(utilityService, api) {
        this.utilityService = utilityService;
        this.api = api;
    }

    getData(transactions, currency1, currency2, timeRange, dataFrequencyLimit) {

        return new Promise((resolve, reject) => {

            if (transactions.length == 0) {
                resolve({
                    dataPoints: []
                });
                return;
            }

            //Sort transaction by date asc
            transactions = this.sortTransactions(transactions);

            let dataFrequency = timeRange <= dataFrequencyLimit ? 'hours' : 'days';
            let limit = this.getLimit(transactions, dataFrequency);

            //We might have asked for 'Last Year' but if we only have transactions going 
            //back a few days then override the dataFrequency and set to hours 
            if (limit < dataFrequencyLimit && dataFrequency == 'days') {
                dataFrequency = 'hours';
                limit = this.getLimit(transactions, dataFrequency);
            }

            let inCurrencies = this.utilityService.getUniqueCurrencies(transactions);

            this.loadDataPoints(inCurrencies.slice(0), currency1, transactions, limit, dataFrequency)
                .then((dataPoints1) => {
                    this.loadDataPoints(inCurrencies.slice(0), currency2, transactions, limit, dataFrequency)
                        .then((dataPoints2) => {
                            resolve({
                                dataPoints: [
                                    this.utilityService.objectToArray(dataPoints1),
                                    this.utilityService.objectToArray(dataPoints2)
                                ],
                                dataFrequency: dataFrequency
                            });
                        })
                });
        });

    }

    loadDataPoints(inCurrencies, toCurrency, transactions, limit, dataFrequency) {

        return new Promise((resolve, reject) => {

            if (!toCurrency) {
                resolve(null);
                return;
            }

            let dataPoints = this.getInitialsedDataPoints(limit, dataFrequency);
            this.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
        });
    }

    loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve) {

        if (inCurrencies.length == 0) {
            resolve(dataPoints);
            return;
        }

        let fromCurrency = inCurrencies.pop();

        if (fromCurrency == toCurrency) {
            let dailyData = this.getSelfReferenceDailyData(dataPoints);
            this.loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData);
            this.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
        }
        else {

            this.api.CryptoCompare.getHistoricalPriceByFrequency(fromCurrency, toCurrency, limit, dataFrequency)
                .then(dailyData => {
                    this.loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData);
                    this.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
                })
        }
    }

    loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData) {

        dailyData.forEach(d => {

            let date = moment.unix(d.time);

            let dataPoint = dataPoints[d.time];

            if (!dataPoint)
                return;

            dataPoint.setPrice(fromCurrency, d.close);
            dataPoint.setStartingAmount(fromCurrency, 0)

            //Find transactions for this day
            let matches = this.getTransactions(transactions, date, fromCurrency);

            matches.forEach((t) => {
                dataPoint.addTransaction(t);
            })

            //Find sales for this day
            matches = this.getSales(transactions, date, fromCurrency);
            matches.forEach((s) => {
                dataPoint.addSale(fromCurrency, s);
            })
        });

    }

    getTransactions(transactions, date, currency) {
        return transactions.filter(t => {
            return (moment(t.date).isBefore(date) && t.currency == currency);
        });
    }

    getSales(transactions, date, currency) {
        let sales = [];
        transactions.forEach(transaction => {

            if (transaction.currency != currency)
                return;

            transaction.sales.forEach(sale => {
                if (moment(sale.date).isBefore(date))
                    sales.push(sale);
            })
        })
        return sales;
    }

    getInitialsedDataPoints(limit, dataFrequency) {

        let dataPoints = {};
        let start = moment().utc().startOf('day');

        for (let i = limit - 1; i >= 0; i--) {
            let date = start.clone().subtract(i, dataFrequency);
            dataPoints[date.unix()] = new DataPoint(date);
        }

        return dataPoints;
    }

    getSelfReferenceDailyData(dataPoints) {
        let dailyData = [];

        for (let d in dataPoints) {
            if (dataPoints.hasOwnProperty(d)) {
                //Close will always be one 
                dailyData.push({
                    time: d,
                    close: 1
                });
            }
        }
        return dailyData;
    }

    //How many days/hours to go back
    getLimit(transactions, dataFrequency) {

        //get the first transaction
        var transaction = transactions[0];

        var firstDate = moment(transaction.date);
        var now = moment().startOf('day');

        var duration = moment.duration(now.diff(firstDate));

        if (dataFrequency == 'days')
            return Math.ceil(duration.asDays());

        return Math.ceil(duration.asHours());
    }

    sortTransactions(transactions) {

        //Sort transaction by date asc
        transactions.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        }).reverse();

        return transactions;

    }
}

module.exports = PortfolioChartService;