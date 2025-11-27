# Goal: Design a Portfolio Tracker (Stock Holdings Manager) that allows a user to buy and sell stocks, update live market prices, and instantly view their profit/loss — exactly like the portfolio screen in Groww, Zerodha or smallcase.

## The system should support:

Buying any quantity of a stock at a given price (multiple buys of the same stock are allowed)  
Selling any quantity of a stock (partial or full) at a given price  
Updating the current market price of any stock in real-time  
Instantly calculating correct average buy price after multiple purchases  
Showing detailed holding for a single stock  
Showing complete portfolio summary with total invested amount, current value, unrealized P&L and % returns

You’ll model it in pure object-oriented design, write fully working code using only in-memory data structures (no database, no HTTP server), and simulate real transactions.ConstraintsOnly one user (single portfolio)  
Stock symbols are strings like "RELIANCE", "TCS", "AAPL"  
You can buy the same stock many times → average buy price must be recalculated correctly using weighted average  
You cannot sell more shares than you currently hold → throw exception if attempted  
If quantity of a stock becomes 0 after selling → remove it completely from the portfolio  
updatePrice() can be called at any time, even if the stock is not in the portfolio yet (handle gracefully)  
All data lives only in memory (use HashMap, List, etc.)  
Code must be clean, extensible, follow SOLID principles, and be easy to read (smallcase interviewers value this heavily)

## 1.1 Functional Requirements
Each user must have an account with a cash balance and a portfolio of owned stocks.
Support trading of multiple stock symbols
Allow users to place limit and market orders (buy or sell)
Allow users to cancel pending (unmatched) orders
Users should be notified of status updates for their orders.
Users should be able to subscribe to stock price updates and receive notifications when the price changes.
Before placing an order, the system must validate it (e.g., check for sufficient funds for a buy order or sufficient stock quantity for a sell order).

## 1.2 Non-Functional Requirements
Concurrency: The system must be thread-safe to handle concurrent requests from multiple users placing orders simultaneously. 
Modularity: The system should be designed using object-oriented principles, with clear separation of concerns between components like accounts, orders, and the matching engine.
Extensibility: The design should be modular and easy to extend. For instance, adding new order types (e.g., Stop-Loss) or different notification channels (e.g., SMS, Email) should not require major refactoring.
Simplicity: The system should provide a simple, high-level interface for clients to perform common actions like placing an order, without exposing the underlying complexity of the matching engine.

--

# My thinking section

## Possible Entities
- Stock: name, id, symbol, etc ..
- Order: type (market or limit), stock, quantity, price
- Broker: 
- User: id, balance, portfolio
- Portfolio: orders, etc  
- Exchange
- Exchanger

## Stock Market Basics
- **Stocks** represent ownership in a company and are traded on exchanges.
- **Price** fluctuates based on supply/demand, company performance, macro factors.
- **Orders**: market (execute immediately at best price) vs limit (execute at specified price).
- **Bid/Ask** spread, order book depth.
- **Dividends**, **splits**, **earnings reports** affect price.

## Broker Role
- **Broker** acts as intermediary between investors and exchanges, routing orders.
- Provides **order execution**, **custody**, **account management**, **research**, **margin**.
- May charge **commission** or **fee‑based** services.
- Types: **Full‑service**, **discount**, **online/robo‑brokers**.
- Brokers must comply with regulations (e.g., SEBI in India, SEC in US).

## Key Entities for Interview
- **Stock**: symbol, name, current price.
- **Order**: id, type, side (buy/sell), quantity, price, status.
- **Broker**: placeOrder(order), cancelOrder(id), getQuotes(symbols).
- **User/Account**: cash balance, holdings, portfolio.
- **Portfolio**: collection of holdings, calculates avg price, unrealized P/L.
- **Exchange**: matches buy/sell orders, maintains order book.
- **MarketDataFeed**: pushes real‑time price updates to broker/portfolio.