import { InsufficientStocksInExchangeError, StockNotInExchangeError } from "../utils/error";
import { Stock } from "../models/stock";
import { OrderType, TransactionType } from "../utils/types";
import { NotificationService } from "../services/notificationService";
import { Mutex } from "../utils/mutex";
import type { Order } from "../models/order";

/**
 * Exchange simulates a simple stock exchange. It stores available stocks and their quantities,
 * processes buy/sell orders and periodically updates market prices.
 * It now emits price‑change events via {@link NotificationService} so observers can react.
 */
interface Stocks {
    stock: Stock,
    quantity: number
}

export class Exchange {
    private static instance: Exchange;
    private static mutex = new Mutex();
    private stocks: Map<string, Stocks> = new Map();
    // TODO: implement limit order matching
    private limitOrders: Map<string, Order> = new Map();

    // For a real matching engine we would keep sorted order books, but a simple array is enough here.
    // private buys: Stocks[] = [];
    // private sells: Stocks[] = [];
    
    private constructor() {
        NotificationService.onNewUserOnBoarding(() => {
            console.log('[EXCHANGE] - A new user has joined us!')
        })
    }

    public static getInstance(): Exchange {
        if (!Exchange.instance) {
            Exchange.instance = new Exchange();
        }
        return Exchange.instance;
    }

    /** Add a stock to the exchange inventory. */
    public async addStocks(stock: Stock, quantity: number): Promise<void> {
        await Exchange.mutex.acquire();
        this.stocks.set(stock.getName(), { stock, quantity });
        Exchange.mutex.release();
    }

    /** Process an order against the exchange inventory. */
    async order(stock: Stock, quantity: number, type: TransactionType, orderType: OrderType): Promise<boolean> {
        await Exchange.mutex.acquire();
        const entry = this.stocks.get(stock.getName());
        if (!entry) {
            throw new StockNotInExchangeError();
        }
        if (orderType === OrderType.MARKET) {
            if (entry.quantity < quantity) {
                throw new InsufficientStocksInExchangeError();
            }
            if (type === TransactionType.BUY) {
                entry.quantity -= quantity;
                // TODO: track buys for price simulation
            } else {
                entry.quantity += quantity;
                // TODO: track sells for price simulation
            }
        }
        else {

        }
        Exchange.mutex.release();
        return true;
    }

    /** Simulate market price fluctuations and broadcast updates. */
    public async startMarket(): Promise<void> {
        setInterval(async () => {
            await Exchange.mutex.acquire();
            this.stocks.forEach(entry => {
                const newPrice = entry.stock.getPrice() + Math.random() * 10;
                entry.stock.setPrice(newPrice);
                NotificationService.emitPriceChange({
                    symbol: entry.stock.getSymbol(),
                    newPrice,
                });
            });
            Exchange.mutex.release();
        }, 1000);
    }
}