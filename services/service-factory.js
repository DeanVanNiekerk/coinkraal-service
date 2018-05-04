
let UtilityService = require('./utility/utility-service');

let TransactionSummaryService = require('./transaction-summary/transaction-summary-service');

let PortfolioChartService = require('./portfolio-chart/portfolio-chart-service');
let CoinRiskChartService = require('./coin-risk-chart/coin-risk-chart-service');

let ChartJsService = require('./chartjs/chartjs-service');


class ServiceFactory {

    utilityService() {
        return new UtilityService();
    }

    transactionSummaryService() {
        return new TransactionSummaryService(this.utilityService());
    }

    portfolioChartService() {
        return new PortfolioChartService(this.utilityService());
    }

    coinRiskChartService() {
        return new CoinRiskChartService();
    }

    chartJsService() {
        return new ChartJsService(this.utilityService());
    }
    
}