import { OrderType, TransactionType, OrderStatus } from "../utils/types";
import type { Stock } from "./stock";

export class Order {
    private status: OrderStatus;
    private id: string;
    
    constructor(
        private type: OrderType,
        private stock: Stock,
        private quantity: number,
        private price: number,
        private transactionType: TransactionType,
        private userId: string
    ) { 
        this.id = crypto.randomUUID();
        this.status = OrderStatus.PENDING;
    }

    getPrice() {
        return this.price;
    }

    getQuantity() {
        return this.quantity;
    }

    getStock() {
        return this.stock;
    }

    getTransactionType() {
        return this.transactionType;
    }

    getStatus() {
        return this.status;
    }

    getType() {
        return this.type;
    }

    getId() {
        return this.id;
    }

}