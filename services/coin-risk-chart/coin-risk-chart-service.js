
class CoinRiskChartService {

    getData(transactionSummaries) {
        
        return new Promise((resolve, reject) => {

            let dataPoints = this.loadDataPoints(transactionSummaries);
            dataPoints = this.reduceDataPoints(dataPoints);
            dataPoints = this.convertToPercentage(dataPoints);

            resolve(dataPoints);
        });
    }

    loadDataPoints(transactionSummaries) {
        return transactionSummaries.map(t => {
            return {
                label: t.currency,
                value: t.btcValue
            }
        });
    }

    //If there are more than 6 datapoints, reduce to 6
    reduceDataPoints(dataPoints) {
        if (dataPoints.length > 6) {
            let others = dataPoints.splice(5, dataPoints.length - 5);
            let othersValue = others.reduce((sum, current) => {
                return sum + current.value;
            }, 0);

            dataPoints.push({
                label: "Others",
                value: othersValue
            });
        }
        return dataPoints;
    }

    //Convert to percentages
    convertToPercentage(dataPoints) {
        let totalValue = dataPoints.reduce((sum, current) => { return sum + current.value; }, 0);
        dataPoints.forEach(dp => {
            dp.value = Math.round(dp.value / totalValue * 100);
        });
        return dataPoints;
    }


}

module.exports = CoinRiskChartService;