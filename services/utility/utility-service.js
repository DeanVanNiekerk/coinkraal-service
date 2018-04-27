
var BigNumber = require('bignumber.js');

class UtilityService {

  getTransactionAmountBalance(transaction) {

    if (!transaction.sales || transaction.sales.length == 0)
      return transaction.amount;

    var salesAmount = transaction.sales
      .map(s => s.amount)
      .reduce((a1, a2) => a1 + a2, 0);

    return new BigNumber(transaction.amount.toString()).minus(salesAmount.toString()).toNumber();
  }

  getUniqueCurrencies(transactions) {
    let currencies = transactions.map(t => {
      return t.currency;
    })
    return currencies.filter(this.unique);
  }

  unique(value, index, self) {
    return self.indexOf(value) === index;
  }

}

module.exports = UtilityService