import { NotificationService } from "../services/notificationService";
import { Portfolio } from "./portfolio";

export class User {
    private id: string;
    private portfolio: Portfolio;
    constructor(
        private balance: number,
        private name?: string,
        private email?: string,
        private number?: string
    ) {
        this.portfolio = new Portfolio(this);
        this.id = crypto.randomUUID();
        NotificationService.onPriceChange((payload) => {
            console.log(`Notification for User ${this.id}: ${payload.symbol} price change to ${payload.newPrice}`);
        });
        NotificationService.onOrderStatus((payload) => {
            console.log(`Notification for User ${this.id}: ${payload.orderId} status change to ${payload.status}`);
        });
    }

    setBalance(balance: number) {
        this.balance = balance;
    }

    getPortfolio() {
        return this.portfolio;
    }

    getBalance() {
        return this.balance;
    }

    getId() {
        return this.id;
    }
}

