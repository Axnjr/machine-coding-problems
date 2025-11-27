import type { Order } from "../models/order";
import { System } from "../models/system";
import { Transaction } from "../models/transaction";
import type { User } from "../models/user";
import { Subject } from "../utils/observable";
import { TransactionType } from "../utils/types";
import { Exchange } from "./exchange";
import { NotificationService } from "./notificationService";

/**
 * Responsible for:
 * - Validating if user can place the order
 * - Placing the order
 * - Canceling the order
 * - Getting the order status
 * - Updating the users portfolio
 * - Updating the users balance
 * Exchange and emits domain events via {@link NotificationService}.
 */
export class Broker {
    /** Singleton instance */
    private static instance: Broker;

    private constructor() { }

    /** Get the global Broker instance */
    public static getInstance(): Broker {
        if (!Broker.instance) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    }

    /** Validate that a user can place the given order */
    public validateOrder(order: Order, userId: string): boolean {
        const user = System.getUser(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (order.getTransactionType() === TransactionType.BUY) {
            const required = order.getPrice() * order.getQuantity();
            if (required > user.getBalance()) {
                console.error("Insufficient balance");
                return false;
            }
        } else {
            const owned = user.getPortfolio().checkStockQuantity(order.getStock());
            if (owned < order.getQuantity()) {
                console.error("Insufficient stocks");
                return false;
            }
        }
        return true;
    }

    /** Register a new user in the system */
    public registerUser(user: User): void {
        System.addUser(user);
    }

    /** Deposit cash into a user's account */
    public deposit(userId: string, amount: number): void {
        const user = System.getUser(userId);
        if (!user) {
            throw new Error("User not found");
        }
        user.setBalance(user.getBalance() + amount);
    }

    /** Helper to pretty‑print all users */
    public displayUsers(): void {
        console.log("======================= Users =======================");
        System.getUsers().forEach(user => {
            console.log(
                "User ID:",
                user.getId(),
                "Balance:",
                user.getBalance(),
                "Portfolio Value:",
                user.getPortfolio().getPortfolioValue(),
                "Portfolio Returns:",
                user.getPortfolio().getTotalReturns()
            );
        });
        console.log("======================= Users =======================");
    }

    /** Place an order on behalf of a user */
    async placeOrder(order: Order, userId: string): Promise<Transaction | undefined> {
        if (!this.validateOrder(order, userId)) {
            NotificationService.emitOrderStatus({
                orderId: order.getId().toString(),
                status: "FAILED",
                userId,
            });
            return;
        }
        const user = System.getUser(userId);
        if (!user) {
            NotificationService.emitOrderStatus({
                orderId: order.getId().toString(),
                status: "FAILED",
                userId,
            });
            return;
        }

        const transaction = new Transaction(order, user);
        await transaction.create();
        return transaction;
    }

    /** Cancel an order – in this simulation we just emit a cancellation event */
    public cancelOrder(orderId: string, userId: string): void {
        NotificationService.emitOrderStatus({
            orderId,
            status: "CANCELLED",
            userId,
        });
        console.log(`Order ${orderId} cancelled for user ${userId}`);
    }

    /** Retrieve order status – placeholder for now */
    public getOrderStatus(orderId: string): string {
        // In a real implementation this would query a store.
        return "pending";
    }
}
