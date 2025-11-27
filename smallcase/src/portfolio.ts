
import { Security } from "./models/security";
import { TradeType } from "./types";
import { getRandomNumber } from "./utils";
import { 
    InsufficientSharesError, 
    InvalidPriceError, 
    InvalidSharesError, 
    StockNotFoundError 
} from "./errors/portfolio-errors";

interface Holding {
    ticker: string;
    quantity: number;
    averageBuyPrice: number;
}

export class Portfolio {
    private holdings: Map<string, Holding> = new Map();

    constructor(securities: Security[]) {
        securities.forEach(s => {
            this.updateHolding(s.getTicker(), s.getPrice(), s.getShares(), TradeType.BUY);
        });
    }

    public addTrade(ticker: string, price: number, shares: number, tradeType: TradeType): void {
        if (shares <= 0) {
            throw new InvalidSharesError();
        }
        if (price < 0) {
            throw new InvalidPriceError();
        }

        this.updateHolding(ticker, price, shares, tradeType);

        const action = tradeType === TradeType.BUY ? "bought" : "sold";
        console.log(`${shares} shares ${action} for ${ticker} at ${price}`);
    }

    private updateHolding(ticker: string, price: number, shares: number, type: TradeType): void {
        let holding = this.holdings.get(ticker);

        if (!holding) {
            if (type === TradeType.SELL) {
                throw new StockNotFoundError(ticker);
            }
            holding = { ticker, quantity: 0, averageBuyPrice: 0 };
            this.holdings.set(ticker, holding);
        }

        if (type === TradeType.BUY) {
            const totalCost = (holding.quantity * holding.averageBuyPrice) + (shares * price);
            const totalShares = holding.quantity + shares;
            holding.quantity = totalShares;
            holding.averageBuyPrice = totalCost / totalShares;
        } else {
            if (holding.quantity < shares) {
                throw new InsufficientSharesError(ticker, shares, holding.quantity);
            }
            holding.quantity -= shares;
            if (holding.quantity === 0) {
                this.holdings.delete(ticker);
            }
        }
    }

    public fetchHoldings(): void {
        // return Array.from(this.holdings.values());
        console.log("====================== HOLDINGS ======================")
        this.holdings.forEach((holding) => {
            console.log(`${holding.ticker}: ${holding.quantity} @ ${holding.averageBuyPrice}`)
        })
        console.log("====================== HOLDINGS ======================")
    }

    public fetchReturns(): number {
        let totalReturn = 0;

        for (const holding of this.holdings.values()) {
            totalReturn += (getRandomNumber(60) - holding.averageBuyPrice) * holding.quantity;
        }

        return totalReturn;
    }
}