import type { RideType } from "../utils/types";
import type { Passenger } from "./passenger";

export class RideRequest {
    // private static counter = 0;
    private id: string;
    constructor(
        private from: string,
        private to: string,
        private rideType: RideType,
        private passenger: Passenger
    ) {
        // this.id = ++RideRequest.counter;
        this.id = Buffer.from(from + to + rideType + passenger.getId()).toString('base64');
    }

    // getters
    public getId(): string { return this.id; }
    public getFrom(): string { return this.from; }
    public getTo(): string { return this.to; }
    public getRideType(): RideType { return this.rideType; }
    public getPassenger(): Passenger { return this.passenger; }

    // public setId(id: string) { this.id = id; }
}