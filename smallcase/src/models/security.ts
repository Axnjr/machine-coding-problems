export class Security {
    private id: string;
    constructor(public ticker: string, public price: number, public shares: number) {
        this.id = crypto.randomUUID();
    }

    public getId(): string {
        return this.id;
    }

    public getTicker(): string {    
        return this.ticker;
    }

    public getPrice(): number {
        return this.price;
    }

    public getShares(): number {
        return this.shares;
    }
}