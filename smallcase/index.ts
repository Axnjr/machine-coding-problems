import { Portfolio } from "./src/portfolio";
import { Security } from "./src/models/security";
import { TradeType } from "./src/types";
import { getRandomNumber } from "./src/utils";

const securities = [
    new Security('TCS', 100, 10),
    new Security('GODREJIND', getRandomNumber(), getRandomNumber()),
    new Security('RELIANCE', getRandomNumber(), getRandomNumber()),
    new Security('WIPRO', getRandomNumber(), getRandomNumber()),
    new Security('GODREJIND', getRandomNumber(), getRandomNumber()),
]

const portfolio = new Portfolio(securities);

portfolio.fetchHoldings()

console.log("\n\n")

// portfolio.addTrade('TCS', getRandomNumber(), getRandomNumber(100), TradeType.BUY);

// to simulate error having less selling more scenario
portfolio.addTrade('TCS', 100, 10, TradeType.SELL);

portfolio.fetchHoldings()

const returns = portfolio.fetchReturns()
console.log(returns)


