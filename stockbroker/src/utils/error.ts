export class InsufficientStocksInExchangeError extends Error {
    constructor(message?: string) {
        super(message)
        this.cause = 'Exchange does not have enough stocks requested!';
        this.name = 'InsufficientStocksInExchange';
    }
}

export class StockNotInExchangeError extends Error {
    constructor(message?: string) {
        super(message)
        this.cause = 'Stock not listed in exchange!';
        this.name = 'StockNotInExchangeError';
    }
}