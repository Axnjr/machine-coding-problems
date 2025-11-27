import { Exchange } from "../services/exchange";
import { NotificationService } from "../services/notificationService";
import { TransactionType } from "../utils/types";
import type { Order } from "./order";
import type { User } from "./user";

export class Transaction {
    private timestamp: Date;
    public status: 'success' | 'failed' | 'pending' = 'pending'
    constructor(private order: Order, private user: User) {
        this.timestamp = new Date();
    }
    async create() {
        const exchange = Exchange.getInstance();
        const success = await exchange.order(
            this.order.getStock(),
            this.order.getQuantity(),
            this.order.getTransactionType(),
            this.order.getType()
        );

        if (!success) {
            NotificationService.emitOrderStatus({
                orderId: this.order.getId().toString(),
                status: "FAILED",
                userId: this.user.getId(),
            });
            this.status = 'failed'
            return;
        }

        this.user.getPortfolio().addTransaction(this)

        // Update user state
        if (this.order.getTransactionType() === TransactionType.BUY) {
            this.user.setBalance(this.user.getBalance() - this.order.getPrice() * this.order.getQuantity());
            this.user.getPortfolio().addOrder(this.order);
        } else {
            this.user.setBalance(this.user.getBalance() + this.order.getPrice() * this.order.getQuantity());
            this.user.getPortfolio().removeOrder(this.order.getId());
        }

        this.status = 'success'

        // Emit success event
        NotificationService.emitOrderStatus({
            orderId: this.order.getId().toString(),
            status: "PLACED",
            userId: this.user.getId(),
        });
    }   
}