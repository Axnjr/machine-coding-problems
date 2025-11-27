export class PortfolioError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InsufficientSharesError extends PortfolioError {
    constructor(ticker: string, requested: number, available: number) {
        super(`Cannot sell ${requested} shares of ${ticker}: Only ${available} shares available`);
    }
}

export class StockNotFoundError extends PortfolioError {
    constructor(ticker: string) {
        super(`Cannot perform operation: ${ticker} not found in portfolio`);
    }
}

export class InvalidSharesError extends PortfolioError {
    constructor() {
        super('Shares must be a positive number');
    }
}

export class InvalidPriceError extends PortfolioError {
    constructor() {
        super('Price must be a non-negative number');
    }
}
