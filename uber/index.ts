import { RideSharingPlatform } from "./src/services/platform";
import { Driver } from "./src/models/driver";
import { Passenger } from "./src/models/passenger";
import { RideType } from "./src/utils/types";
import { RideRequest } from "./src/models/request";

const platform = new RideSharingPlatform();

platform.registerDriver(new Driver("driver1", "location1", RideType.Regular));
platform.registerDriver(new Driver("driver2", "location2", RideType.Premimum));
platform.registerDriver(new Driver("driver3", "location3", RideType.Go));
platform.registerDriver(new Driver("driver4", "location4", RideType.Sedan));
platform.registerDriver(new Driver("driver5", "location5", RideType.Intercity));

const passenger = new Passenger("passenger1");
passenger.addFunds(10000);

platform.registerPassenger(passenger);

const rideId = await platform.requestRide(new RideRequest("Mumbai", "Delhi", RideType.Regular, passenger));
const ride = await platform.pollForRideResponses(rideId)

if (ride) {
    console.log("Ride accepted", ride)
} else {
    console.log("Ride not accepted")
}