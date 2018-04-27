
class DataPoint {

    constructor(date) {
        this.date = date;
        this.amounts = [];
        this.prices = [];
    }

    setStartingAmount(currency, value) {
        this.amounts[currency] = value;
    }

    setPrice(currency, price) {
        this.prices[currency] = price;
    }

    addTransaction(transaction) {
        this.amounts[transaction.currency] += transaction.amount;
    }

    addSale(currency, sale) {
        this.amounts[currency] -= sale.amount;
    }

    getTotal() {

        let total = 0;
        for (let currency in this.prices) {
            if (this.prices.hasOwnProperty(currency)) {
                total += this.prices[currency] * this.amounts[currency];
            }
        }
        return total;
        
    }
}

module.exports = DataPoint;

