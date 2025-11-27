import type { Driver } from "../models/driver";
import type { Passenger } from "../models/passenger";
import type { RideRequest } from "../models/request";


export enum RideStatus {
    Pending = "Pending",
    Accepted = "Accepted",
    Completed = "Completed",
    Cancelled = "Cancelled",
}

export class Ride {
    constructor(
        public readonly id: string,
        public readonly driver: Driver,
        public readonly passenger: Passenger,
        public readonly request: RideRequest,
        public fare: number,
        public status: RideStatus = RideStatus.Pending
    ) { }
}
