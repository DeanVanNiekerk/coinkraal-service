
let Api = require('coinkraal-agent');

let UtilityService = require('./utility/utility-service');

let TransactionSummaryService = require('./transaction-summary/transaction-summary-service');

let PortfolioChartService = require('./portfolio-chart/portfolio-chart-service');
let CoinRiskChartService = require('./coin-risk-chart/coin-risk-chart-service');
let CoinChartService = require('./coin-chart/coin-chart-service');

let ChartJsService = require('./chartjs/chartjs-service');


class ServiceFactory {

    constructor() {
        this.api = new Api('', () => { }, () => { });
    }

    utilityService() {
        return new UtilityService();
    }

    transactionSummaryService() {
        return new TransactionSummaryService(this.utilityService());
    }

    portfolioChartService() {
        return new PortfolioChartService(this.utilityService(), this.api);
    }

    coinChartService() {
        return new CoinChartService(this.api);
    }

    coinRiskChartService() {
        return new CoinRiskChartService();
    }

    chartJsService() {
        return new ChartJsService(this.utilityService());
    }

}

module.exports = ServiceFactory;