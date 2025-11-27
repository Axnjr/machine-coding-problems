import type { RideRequest } from "../models/request";
import { Observer, type ListnerCallback } from "../utils/observer";
import type { DriversResponse } from "../utils/types";

export class NotificationService {
    private static rideObserver = new Observer<RideRequest>();
    // payload: { driverId: string, requestId: string, accepted: boolean }
    private static driverResponseObserver = new Observer<DriversResponse>();

    // Ride request events (new ride requests)
    public static onRideEvent(listner: ListnerCallback<RideRequest>) {
        NotificationService.rideObserver.subscribe(listner);
    }
    public static notifyRideEvent(payload: RideRequest) {
        NotificationService.rideObserver.notify(payload);
    }

    // Driver response events (accept/deny)
    public static onDriverResponse(listner: ListnerCallback<DriversResponse>) {
        NotificationService.driverResponseObserver.subscribe(listner);
    }
    public static notifyDriverResponse(driverId: string, requestId: string, accepted: boolean) {
        NotificationService.driverResponseObserver.notify({ driverId, requestId, accepted });
    }
}