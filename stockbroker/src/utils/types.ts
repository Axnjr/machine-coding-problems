import type { Stock } from "../models/stock";

export enum OrderType {
    LIMIT,
    MARKET
}

export enum TransactionType {
    BUY,
    SELL
}

export enum OrderStatus {
    PENDING,
    COMPLETED,
    CANCELLED,
    PARTIALLY_COMPLETED
}

export enum ExchageEnum {
    NSE,
    BSE
}