import type { RideRequest } from "../models/request";
import { RideType } from "../utils/types";

/**
 * Simple fare calculator.
 *
 * The algorithm is deliberately straightforward for the interview:
 *   fare = baseFare + distanceRate * distance + timeRate * time
 *
 * In a production system you would inject a routing / distance service
 * and possibly apply surge‑pricing, discounts, taxes, etc.
 */
export class FareCalculator {
    // Base fares per ride type (arbitrary units)
    private readonly baseFares: Record<RideType, number> = {
        [RideType.Regular]: 5,
        [RideType.Premimum]: 10,
        [RideType.Go]: 4,
        [RideType.Sedan]: 8,
        [RideType.Intercity]: 12,
    };

    // Per‑kilometre rates per ride type
    private readonly distanceRates: Record<RideType, number> = {
        [RideType.Regular]: 1,
        [RideType.Premimum]: 1.5,
        [RideType.Go]: 0.9,
        [RideType.Sedan]: 1.3,
        [RideType.Intercity]: 2,
    };

    // Time rate (same for all ride types)
    private readonly timeRate = 0.2; // per minute, arbitrary units

    /**
     * Calculate the fare for a given ride request.
     *
     * For the purpose of this demo we use fixed distance (10 km) and
     * time (15 min). Replace these constants with a real routing service
     * when you extend the solution.
     */
    public calculate(req: RideRequest): number {
        const rideType = req.getRideType();
        const distanceKm = req.getFrom().length + req.getTo().length ; // stubbed distance
        const timeMin = distanceKm * 2; // stubbed time
        const base = this.baseFares[rideType];
        const distanceCost = this.distanceRates[rideType] * distanceKm;
        const timeCost = this.timeRate * timeMin;
        const fare = base + distanceCost + timeCost;
        return Math.round(fare * 100) / 100; // two‑decimal precision
    }
}
