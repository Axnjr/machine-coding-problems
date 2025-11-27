import { Broker } from "./src/services/broker";
import { User } from "./src/models/user";
import { Stock } from "./src/models/stock";
import { ExchageEnum, OrderType, TransactionType } from "./src/utils/types";
import { Exchange } from "./src/services/exchange";
import { Order } from "./src/models/order";

const broker = Broker.getInstance();
const exchange = Exchange.getInstance();

const users = [
    new User(1000, "Radha", "radha@gmail.com", "1234567890"),
    new User(1000, "John", "john@gmail.com", "1234567890"),
    new User(1000, "Jane", "jane@gmail.com", "1234567890"),
]

users.forEach(user => {
    broker.registerUser(user)
})

const stocks = [
    new Stock('AAPL', 'Apple', 100, ExchageEnum.NSE),
    new Stock('MSFT', 'Microsoft', 200, ExchageEnum.BSE),
    new Stock('GOOGL', 'Google', 300, ExchageEnum.NSE),
    new Stock('AMZN', 'Amazon', 400, ExchageEnum.BSE),
    new Stock('TSLA', 'Tesla', 500, ExchageEnum.NSE),
]

stocks.forEach((stock, i) => {
    exchange.addStocks(stock, stock.getPrice() * i)
})

broker.displayUsers()

// @ts-ignore
const order = new Order(OrderType.MARKET, stocks[0], 180, 10, TransactionType.BUY)
const transaction = await broker.placeOrder(order, users[0]?.getId() || '')

if (transaction?.status === 'success') {
    console.log("Transaction placed successfully")
}

