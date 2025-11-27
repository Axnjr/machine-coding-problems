import type { Driver } from "../models/driver";
import type { Passenger } from "../models/passenger";
import type { RideRequest } from "../models/request";
import { NotificationService } from "./notifications";
import { Mutex } from "../utils/mutex";
import { Ride, RideStatus } from "../models/ride";
import type { DriversResponse } from "../utils/types";
import { FareCalculator } from "./fareCalculator";

export class RideSharingPlatform {
    private readonly mutex = new Mutex();
    private requests: Map<string, RideRequest> = new Map(); // requestId -> request
    private users: Map<string, Passenger> = new Map();
    private drivers: Map<string, Driver> = new Map(); // driverId -> driver
    private activeRides: Map<string, Ride> = new Map(); // rideId -> Ride
    private fareCalculator = new FareCalculator();

    constructor() {
        // Subscribe to driver responses (accept/deny)
        NotificationService.onDriverResponse(this.handleDriverResponse.bind(this));
    }

    /**
     * Passenger creates a ride request.
     */
    async requestRide(req: RideRequest): Promise<string> {
        const reqId = req.getId()
        // Ensure thread‑safety when mutating shared collections
        await this.mutex.acquire();
        try {
            this.requests.set(req.getId(), req);
            NotificationService.notifyRideEvent(req);
        } finally {
            this.mutex.release();
        }
        return reqId
    }

    registerDriver(driver: Driver) {
        this.drivers.set(driver.getId(), driver);
    }

    registerPassenger(passenger: Passenger) {
        this.users.set(passenger.getId(), passenger);
    }

    /**
     * Poll the platform for a completed ride.
     * Returns the Ride object once the driver has accepted the request, or `undefined`
     * after `maxIterations` attempts (default 10 seconds).
     */
    async pollForRideResponses(rideId: string, maxIterations: number = 10): Promise<Ride | undefined> {
        for (let i = 0; i < maxIterations; i++) {
            const ride = this.activeRides.get(rideId);
            if (ride?.status) {
                return ride;
            }
            // wait 1 second before next poll
            await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
        }
        // No ride was created within the timeout
        return undefined;
    }

    /**
     * Internal handler for driver accept/deny events.
     */
    private async handleDriverResponse(payload: DriversResponse) {
        const { driverId, requestId, accepted } = payload;
        await this.mutex.acquire();
        try {
            const driver = this.drivers.get(driverId);
            const request = this.requests.get(requestId);
            if (!driver || !request) return; // unknown driver or request

            // If the request has already been assigned, ignore further responses
            if (request === undefined) return;

            if (accepted) {
                // Create a Ride, calculate fare, and store it
                const passenger = this.users.get(request.getPassenger().getId());

                if (!passenger) return;

                const fare = this.fareCalculator.calculate(request);

                try {
                    passenger.charge(fare)
                } catch (error) {
                    console.log(error)
                    return;
                }

                const rideId = request.getId() // simple unique id (could be improved)
                const ride = new Ride(rideId, driver, passenger, request, fare, RideStatus.Accepted);

                this.activeRides.set(rideId, ride);
                // Remove the request from pending pool
                this.requests.delete(requestId);
            } else {
                console.log(`Driver ${driverId} denied request ${requestId}`);
                // Driver denied – no state change needed beyond logging
                // Could implement retry logic or notify passenger (out of scope)
            }
        } finally {
            this.mutex.release();
        }
    }
}