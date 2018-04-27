
var TransactionSummaryService = require('./transaction-summary-service');
var UtilityService = require('../utility/utility-service');

describe('TransactionSummaryService()', function () {

    it('mergeCurrencies - 1 fiat, 1 crypto', function () {

        //Given:
        var service = new TransactionSummaryService()
        var fiats = [ { symbol: 'USD'} ];
        var cryptos = [ { symbol: 'BTC'} ];

        //When: 
        var currencies = service.mergeCurrencies(fiats, cryptos);

        //Then:
        expect(currencies).toEqual(['USD', 'BTC']);

    });

    it('getTransactionsForCurrency - 3 transactions', function () {

        //Given:
        var service = new TransactionSummaryService()
        var t1 = { currency: 'BTC' };
        var t2 = { currency: 'ETH' };
        var t3 = { currency: 'BTC' };

        //When: 
        var transactions = service.getTransactionsForCurrency([t1, t2, t3], 'ETH');

        //Then:
        expect(transactions).toEqual([t2]);

    });

    it('getTransactionsTotalAmount - 3 transactions', function () {

        //Given:
        var utility = new UtilityService()
        var service = new TransactionSummaryService(utility)
        var t1 = { amount: 100, sales: [ { amount: 10 }, { amount: 20 } ] }; //Total 70
        var t2 = { amount: 200, sales: [ { amount: 50 }, { amount: 10 } ] }; //Total 140
        var t3 = { amount: 100, sales: [ { amount: 10 } ] }; //Total 90

        //When: 
        var amount = service.getTransactionsTotalAmount([t1, t2, t3]);

        //Then:
        expect(amount).toBe(300);

    });

    it('getExchangeRate - no exchange rate', function () {

        //Given:
        var service = new TransactionSummaryService()
        var t1 = { 
            exchangeRates: {
                rates: [
                    { symbol: 'ETH', rate: 100 }
                ]
            }
         };

        //When: 
        var rate = service.getExchangeRate(t1, 'BTC');

        //Then:
        expect(rate).toBe(0);

    });

    it('getExchangeRate - has exchange rate', function () {

        //Given:
        var service = new TransactionSummaryService()
        var t1 = { 
            exchangeRates: {
                rates: [
                    { symbol: 'ETH', rate: 100 },
                    { symbol: 'BTC', rate: 200 }
                ]
            }
         };

        //When: 
        var rate = service.getExchangeRate(t1, 'BTC');

        //Then:
        expect(rate).toBe(200);

    });

    it('invertExchange - no value', function () {

        //Given:
        var service = new TransactionSummaryService()

        //When: 
        var exchange = service.invertExchange(null);

        //Then:
        expect(exchange).toBe(0);
    });


    it('invertExchange - has value', function () {

        //Given:
        var service = new TransactionSummaryService()

        //When: 
        var exchange = service.invertExchange(5);

        //Then:
        expect(exchange).toBe(0.2);
    });


    it('getCurrentPriceInBtc - no price index', function () {

        //Given:
        var service = new TransactionSummaryService()

        //When: 
        var price = service.getCurrentPriceInBtc('NEO', null);

        //Then:
        expect(price).toBe(0);
    });


    it('getCurrentPriceInBtc - no btc price index', function () {

        //Given:
        var service = new TransactionSummaryService()
        var priceIndex = [];

        //When: 
        var price = service.getCurrentPriceInBtc('NEO', priceIndex);

        //Then:
        expect(price).toBe(0);
    });


    it('getCurrentPriceInBtc - no btc price index', function () {

        //Given:
        var service = new TransactionSummaryService()
        var priceIndex = [];
        priceIndex['BTC'] = [];
        priceIndex['BTC']['ETH'] = 10;
        priceIndex['BTC']['NEO'] = 5;

        //When: 
        var price = service.getCurrentPriceInBtc('NEO', priceIndex);

        //Then:
        expect(price).toBe(0.2);
    });


    it('getAveragePurchaseUnitPrice - 1 transaction', function () {

        //Given:
        var service = new TransactionSummaryService()
        var t1 = { amount: 100, purchaseCurrency: 'BTC', purchaseUnitPrice: 2 }; 

        //When: 
        var price = service.getAveragePurchaseUnitPrice('BTC', [ t1 ]);

        //Then:
        expect(price).toBe(2);
    });

    it('getAveragePurchaseUnitPrice - 2 transaction', function () {

        //Given:
        var service = new TransactionSummaryService()
        var t1 = { amount: 100, purchaseCurrency: 'BTC', purchaseUnitPrice: 2 }; 
        var t2 = { amount: 200, purchaseCurrency: 'BTC', purchaseUnitPrice: 5 }; 

        //When: 
        var price = service.getAveragePurchaseUnitPrice('BTC', [ t1, t2 ]);

        //Then:
        expect(price).toBe(4);
    });


    it('getTransactionSummaries - integration', function (done) {


        //Given:
        var utility = new UtilityService();
        var service = new TransactionSummaryService(utility)
        var t1 = { amount: 100, purchaseCurrency: 'BTC', purchaseUnitPrice: 2, sales: [], exchangeRates: { rates: [ { symbol: 'BTC', rate: 200 } ] } }; 

        var priceIndex = [];
        priceIndex['BTC'] = [];

        var fiats = [ { symbol: 'USD'} ];
        var cryptos = [ { symbol: 'BTC'} ];

        //When: 
        var promise = service.getTransactionSummaries([ t1 ], fiats, cryptos, priceIndex);

        //Then:
        promise.then(summaries => {
           
            let s1 = summaries[0];
            
            expect(s1.totalAmount).toEqual(100);
            expect(s1.averagePurchaseUnitPrice).toEqual(2);
            expect(s1.purchaseCurrency).toEqual('BTC');

            done();
        })
    });

})