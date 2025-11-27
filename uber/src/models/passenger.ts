export class Passenger {
    private balance: number = 0
    constructor(private id: string) {}
    public getId() {
        return this.id
    }
    public addFunds(money: number) {
        this.balance += money
    }
    public charge(fare: number){
        if (this.balance < fare) throw new Error("User has Insufficient balance to book a Ride")
        this.balance -= fare
    }
}