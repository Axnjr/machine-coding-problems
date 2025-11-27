import type { Order } from "./order";
import type { Stock } from "./stock";
import type { User } from "./user";
import type { Transaction } from "./transaction";

export class Portfolio {
    private orders: Order[] = [];
    private transactionHistory: Transaction[] = [];
    constructor(private user: User) { }

    addOrder(order: Order) {
        this.orders.push(order);
    }

    removeOrder(orderId: string) {
        this.orders = this.orders.filter(order => order.getId() != orderId);
    }

    getTotalReturns() {
        return this.orders.reduce((total, order) => {
            return total + order.getPrice() * order.getQuantity();
        }, 0);
    }

    getPortfolioValue() {
        return this.getTotalReturns() + this.user.getBalance();
    }

    checkStockQuantity(stock: Stock) {
        const stockOrders = this.orders.filter(order => order.getStock() == stock)
        return stockOrders.reduce((total, order) => total + order.getQuantity(), 0)
    }

    addTransaction(transaction: Transaction) {
        this.transactionHistory.push(transaction);
    }

    showAllTransactions() {
        console.log("Transactions for user " + this.user.getId());
        this.transactionHistory.forEach(transaction => {
            console.log(transaction);
        });
    }
}