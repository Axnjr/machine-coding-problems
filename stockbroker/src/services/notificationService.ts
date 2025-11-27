/**
 * Types for notification payloads.
 */
export interface PriceChangePayload {
    symbol: string;
    newPrice: number;
}

export interface OrderStatusPayload {
    orderId: string;
    status: 'PLACED' | 'CANCELLED' | 'COMPLETED' | 'FAILED';
    userId: string;
}

import { Subject } from '../utils/observable';

/**
 * Central notification hub exposing subjects for price changes and order status updates.
 * Other services can subscribe to these subjects to receive real‑time events.
 */
export class NotificationService {
    // Subject for stock price updates.
    private static priceSubject = new Subject<PriceChangePayload>();

    // Subject for order status updates.
    private static orderSubject = new Subject<OrderStatusPayload>();

    // Subject for new user updates.
    private static newUserSubject = new Subject<string>();

    /** Subscribe to price change events. */
    static onPriceChange(
        listener: (payload: PriceChangePayload) => void
    ): () => void {
        return NotificationService.priceSubject.subscribe(listener);
    }

    /** Subscribe to order status events. */
    static onOrderStatus(
        listener: (payload: OrderStatusPayload) => void
    ): () => void {
        return NotificationService.orderSubject.subscribe(listener);
    }

    /** Subscribe to new user events */
    static onNewUserOnBoarding(listener: (payload: string) => void): () => void {
        return NotificationService.newUserSubject.subscribe(listener)
    }

    static emitNewUserEvent(payload: string): void {
        NotificationService.newUserSubject.notify(payload)
    }

    /** Internal helpers used by services to emit events. */
    static emitPriceChange(payload: PriceChangePayload): void {
        NotificationService.priceSubject.notify(payload);
    }

    static emitOrderStatus(payload: OrderStatusPayload): void {
        NotificationService.orderSubject.notify(payload);
    }
}
