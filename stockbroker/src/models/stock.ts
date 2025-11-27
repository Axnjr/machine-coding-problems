import type { ExchageEnum } from "../utils/types";

export class Stock {
    constructor(
        private symbol: string,
        private name: string,
        private price: number,
        private exchage: ExchageEnum
    ) { }

    setPrice(price: number) {
        this.price = price
    }

    getSymbol() {
        return this.symbol;
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getExchange() {
        return this.exchage;
    }
}