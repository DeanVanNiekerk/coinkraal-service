
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
      var t1 = { amount: 100, sales: [ { amount: 10 }, { amount: 20 } ] };

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

})