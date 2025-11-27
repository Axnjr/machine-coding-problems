import { NotificationService } from "../services/notifications";
import type { RideType } from "../utils/types";
import type { RideRequest } from "./request";

export class Driver {
    private income: number = 0
    constructor(private id: string, private currentLocation: string, private type: RideType) {
        NotificationService.onRideEvent(this.handleRideRequest.bind(this))
    }

    getId() {
        return this.id
    }

    // simulate drivers behaviour
    private async handleRideRequest(req: RideRequest) {
        const probability = Math.random()
        // a time delay to simulate real life scenario where drivers take time to accept/deny requests
        const timeDelay = Math.random() * 1000
        if (probability >= 0.5) setTimeout(() => this.acceptRideRequest(req), timeDelay)
        else setTimeout(() => this.denyRideRequest(req), timeDelay)
    }

    acceptRideRequest(req: RideRequest) {
        // Notify platform that this driver accepts the ride request
        NotificationService.notifyDriverResponse(this.id, req.getId(), true);
    }

    denyRideRequest(req: RideRequest) {
        // Notify platform that this driver denies the ride request
        NotificationService.notifyDriverResponse(this.id, req.getId(), false);
    }
}