

var DataPoint = require('./data-point');

describe('DataPoint()', function () {
  it('initialize', function () {
    
    //Given:
    var date = new Date();
    
    //When: 
    var dataPoint = new DataPoint(date)

    //Then:
    expect(dataPoint.date).toBe(date);
    expect(dataPoint.amounts).toEqual([]);
    expect(dataPoint.prices).toEqual([]);
  });

  it('setStartingAmount - amount is set', function () {
    
    //Given:
    var dataPoint = new DataPoint()
    
    //When: 
    dataPoint.setStartingAmount('BTC', 1);

    //Then:
    var expected = [];
    expected['BTC'] = 1;
    expect(dataPoint.amounts).toEqual(expected);
  });

  it('setPrice - price is set', function () {
    
    //Given:
    var dataPoint = new DataPoint()
    
    //When: 
    dataPoint.setPrice('ETH', 1.5);

    //Then:
    var expected = [];
    expected['ETH'] = 1.5;
    expect(dataPoint.prices).toEqual(expected);
  });

  it('addTransaction - add amount', function () {
    
    //Given:
    var dataPoint = new DataPoint()
    dataPoint.setStartingAmount('BTC', 1);

    //When: 
    dataPoint.addTransaction({
      currency: 'BTC',
      amount: 2.5
    });

    //Then:
    var expected = [];
    expected['BTC'] = 3.5;
    expect(dataPoint.amounts).toEqual(expected);
  });

  it('addSale - subtract amount', function () {
    
    //Given:
    var dataPoint = new DataPoint()
    dataPoint.setStartingAmount('BTC', 2);

    //When: 
    dataPoint.addSale('BTC', { amount: 1.5 });

    //Then:
    var expected = [];
    expected['BTC'] = 0.5;
    expect(dataPoint.amounts).toEqual(expected);
  });

  it('getTotal - 1 currency', function () {
    
    //Given:
    var dataPoint = new DataPoint()
    dataPoint.setStartingAmount('BTC', 10);
    dataPoint.setPrice('BTC', 2);

    //When: 
    var total = dataPoint.getTotal();

    //Then:
    expect(total).toBe(20);
  });

  it('getTotal - 2 currencies', function () {
    
    //Given:
    var dataPoint = new DataPoint()
    dataPoint.setStartingAmount('BTC', 10);
    dataPoint.setStartingAmount('ETH', 30);
    dataPoint.setPrice('ETH', 3);
    dataPoint.setPrice('BTC', 2);

    //When: 
    var total = dataPoint.getTotal();

    //Then:
    expect(total).toBe(110);
  });

});