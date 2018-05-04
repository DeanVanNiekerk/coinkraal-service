
var UtilityService = require('./utility-service');

describe('UtilityService()', function () {

    it('getTransactionAmountBalance - no sales', function () {

        //Given:
        var service = new UtilityService()
        var t1 = { amount: 100, sales: [] };

        //When: 
        var balance = service.getTransactionAmountBalance(t1);

        //Then:
        expect(balance).toBe(100);

    });

    it('getTransactionAmountBalance - 2 sales', function () {

        //Given:
        var service = new UtilityService()
        var t1 = { amount: 100, sales: [{ amount: 10 }, { amount: 20 }] };

        //When: 
        var balance = service.getTransactionAmountBalance(t1);

        //Then:
        expect(balance).toBe(70);

    });

    it('getUniqueCurrencies - 3 transaction', function () {

        //Given:
        var service = new UtilityService()

        var t1 = { currency: 'BTC' };
        var t2 = { currency: 'ETH' };
        var t3 = { currency: 'BTC' };


        //When: 
        var currencies = service.getUniqueCurrencies([t1, t2, t3]);

        //Then:
        expect(currencies).toEqual(['BTC', 'ETH']);

    });

    it('objectToArray - empty object', function () {

        //Given:
        var service = new UtilityService()

        var obj = { };

        //When: 
        var arr = service.objectToArray(obj);

        //Then:
        expect(arr).toEqual([]);

    });

    it('objectToArray - object with 2 props', function () {

        //Given:
        var service = new UtilityService()

        var obj = { 
            "prop1": "val1",
            "prop2": "val2"
        };

        //When: 
        var arr = service.objectToArray(obj);

        //Then:
        expect(arr).toEqual(["val1", "val2"]);

    });


    it('isNaN - empty string', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var isNaN = service.isNaN("");

        //Then:
        expect(isNaN).toEqual(true);

    });


    it('isNaN - number', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var isNaN = service.isNaN(20);

        //Then:
        expect(isNaN).toEqual(false);

    });


    it('isNaN - string', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var isNaN = service.isNaN("test");

        //Then:
        expect(isNaN).toEqual(true);

    });


    it('formatCurrency - empty string -> ?', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency("");

        //Then:
        expect(curr).toEqual("?");

    });


    it('formatCurrency - random text -> ?', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency("random text");

        //Then:
        expect(curr).toEqual("?");

    });


    it('formatCurrency - 1 -> 1', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency(1);

        //Then:
        expect(curr).toEqual('1');

    });

    it('formatCurrency - 0.08257 -> 0.0826', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency(0.08257);

        //Then:
        expect(curr).toEqual('0.0826');

    });

    it('formatCurrency - 0.008574 -> 0.008574', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency(0.008574);

        //Then:
        expect(curr).toEqual('0.008574');

    });


    it('formatCurrency - 0.00087595233 -> 0.00087595', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency(0.00087595233);

        //Then:
        expect(curr).toEqual('0.00087595');

    });

    it('formatCurrency - 1001 -> 1001', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var curr = service.formatCurrency(1001);

        //Then:
        expect(curr).toEqual('1,001');

    });

    it('getCurrencyColour - BTC', function () {

        //Given:
        var service = new UtilityService()

        //When: 
        var colour = service.getCurrencyColour('BTC');

        //Then:
        expect(colour).toEqual('rgba(253, 126, 20, 0.8)');

    });


})