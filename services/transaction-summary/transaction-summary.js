

class TransactionSummary {

    constructor() {
        this.currency = '';
        this.purchaseCurrency = '';
        this.totalAmount = 0;
        this.averagePurchaseUnitPrice = 0;
        this.averagedExchangeRates = null;
        this.btcValue = 0;
    }
    
}

module.exports = TransactionSummary;