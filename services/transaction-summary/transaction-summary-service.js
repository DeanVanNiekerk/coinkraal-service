var BigNumber = require('bignumber.js');
var TransactionSummary = require('./transaction-summary');

class TransactionSummaryService {

    constructor(utilityService) {
        this.utilityService = utilityService;
    }

    getTransactionSummaries(transactions, fiats, coins, priceIndex) {

        return new Promise((resolve, reject) => {

            let summaries = [];
            let uniqueCurrencies = this.utilityService.getUniqueCurrencies(transactions);
            let allCurrencies = this.mergeCurrencies(fiats, coins); //This is a FULL list of all currencies

            uniqueCurrencies.forEach(currency => {

                let summary = new TransactionSummary();
                summary.currency = currency;

                let matches = this.getTransactionsForCurrency(transactions, currency);

                summary.totalAmount = this.getTransactionsTotalAmount(matches);

                //No coins left in the this transaction
                if(summary.totalAmount == 0)
                    return;

                //Convert ALL as if they were purchased in BTC                                
                summary.purchaseCurrency = "BTC";

                let exchangeRates = {
                    fromSymbol: currency,
                    rates: []
                }

                allCurrencies.forEach(c => {

                    let averageUnitPrice = this.getAveragePurchaseUnitPrice(c, matches);

                    if (c == summary.purchaseCurrency) {
                        summary.averagePurchaseUnitPrice = averageUnitPrice;
                        summary.btcValue = this.getCurrentPriceInBtc(summary.currency, priceIndex) * summary.totalAmount; //Only really need this for ordering..
                    }
                    else {
                        let rate = {
                            symbol: c,
                            rate: averageUnitPrice
                        }
                        exchangeRates.rates.push(rate);
                    }
                });

                summary.averagedExchangeRates = exchangeRates;

                summaries.push(summary);
            });

            summaries.sort((s1, s2) => {
                return new BigNumber(s2.btcValue.toString()).minus(s1.btcValue.toString()).toNumber();
            })

            resolve(summaries);
        });
    }

    getAveragePurchaseUnitPrice(fromSymbol, transactions) {

        let totalUnitPrice = new BigNumber(0);
        let totalAmount = new BigNumber(0);

        transactions.forEach(t => {

            let amount = new BigNumber(t.amount.toString());
            totalAmount = totalAmount.plus(amount);

            let unitPrice;
            if (t.purchaseCurrency == fromSymbol)
                unitPrice = new BigNumber(t.purchaseUnitPrice.toString());
            else
                unitPrice = new BigNumber(this.getExchangeRate(t, fromSymbol).toString());

            totalUnitPrice = totalUnitPrice.plus(unitPrice.multipliedBy(amount)); //weighted average
        });

        return new BigNumber(totalUnitPrice).dividedBy(totalAmount).toNumber();
    }

    mergeCurrencies(fiats, coins) {
        fiats = fiats.map(f => f.symbol);
        coins = coins.map(c => c.symbol);
        return fiats.concat(coins);
    }

    getTransactionsForCurrency(transactions, currency) {
        return transactions.filter(t => {
            return t.currency == currency;
        });
    }

    getTransactionsTotalAmount(transactions) {
        let total = 0;
        transactions.forEach(t => {
            let balance = this.utilityService.getTransactionAmountBalance(t);
            total += balance;
        });
        return total;
    }

    getExchangeRate(transaction, currency) {

        let rate = transaction.exchangeRates.rates.find(r => {
            return r.symbol == currency;
        })

        if (!rate)
            return 0;

        return rate.rate;
    }

    invertExchange(value) {
        if (value == null)
            return 0;
        return new BigNumber(1).dividedBy(value).toNumber();
    }

    getCurrentPriceInBtc(targetSymbol, priceIndex) {
        if (!priceIndex || !priceIndex['BTC'])
            return 0;
        return this.invertExchange(priceIndex['BTC'][targetSymbol]);
    }



}

module.exports = TransactionSummaryService;