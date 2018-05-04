
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

  objectToArray(obj) {
    let arr = [];
    for (let k in obj) {
      if (obj.hasOwnProperty(k))
        arr.push(obj[k]);
    }
    return arr;
  }

  isNaN(number) {
    if (number === "")
      return true;
    return isNaN(number);
  }

  formatCurrency(amount) {

    if (this.isNaN(amount))
      return '?';

    let minimumFractionDigits = 2;
    let maximumFractionDigits = 2;

    if (amount <= 0.09)
      maximumFractionDigits = 4

    if (amount <= 0.009)
      maximumFractionDigits = 6

    if (amount <= 0.0009)
      maximumFractionDigits = 8

    if (amount >= 1000 || amount % 1 == 0) {
      maximumFractionDigits = 0;
      minimumFractionDigits = 0;
    }

    return parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: maximumFractionDigits
    });
  }


  getCurrencyColour(currency) {

    switch (currency) {
      case "BTC":
        return "rgba(253, 126, 20, 0.8)";
      case "ETH":
        return "rgba(74, 144, 226, 0.8)";
      case "NEO":
        return "rgba(139, 195, 74, 0.8)";
      default:
        return "rgba(40, 167, 69, 0.8)";
    }

  }

}

module.exports = UtilityService