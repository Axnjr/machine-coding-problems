import { FifoQueue, type Queue } from "./queue";
import type { Elevator } from "../models/elevator";

/**
 * Scheduling algorithm used by the Controller.
 * Provides a FIFO queue for external hall requests and a method to select the best elevator.
 */
export interface SchedulingAlgorithm {
    /** Queue that stores external floor requests (FIFO) */
    queue: Queue;
    /**
     * Choose the most suitable elevator for the request.
     * @param elevators   All elevators in the system.
     * @param targetFloor The floor where the call was made.
     * @param direction   Desired travel direction (UP/DOWN).
     * @returns The id of the chosen elevator.
     */
    findClosestElevator(
        elevators: Elevator[],
        targetFloor: number,
        direction: "UP" | "DOWN"
    ): number;
}

/** Simple implementation that prefers idle elevators, then moving‑towards elevators. */
export class SimpleElevatorScheduling implements SchedulingAlgorithm {
    queue: Queue = new FifoQueue();

    findClosestElevator(
        elevators: Elevator[],
        targetFloor: number,
        direction: "UP" | "DOWN"
    ): number {
        if (elevators.length === 0) throw new Error("No elevators available");

        // 1️⃣ Look for idle elevators closest to the floor
        let bestId = -1;
        let bestDist = Infinity;
        for (const e of elevators) {
            const dist = Math.abs(e.getCurrentFloor() - targetFloor);
            if (e.getDirection() === "IDLE" && dist < bestDist) {
                bestDist = dist;
                bestId = e.getId();
            }
        }
        if (bestId !== -1) return bestId;

        // 2️⃣ Look for elevators already moving towards the request in the same direction
        bestDist = Infinity;
        for (const e of elevators) {
            const movingTowards =
                (e.getDirection() === "UP" && e.getCurrentFloor() <= targetFloor && direction === "UP") ||
                (e.getDirection() === "DOWN" && e.getCurrentFloor() >= targetFloor && direction === "DOWN");
            if (movingTowards) {
                const dist = Math.abs(e.getCurrentFloor() - targetFloor);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestId = e.getId();
                }
            }
        }
        if (bestId !== -1) return bestId;

        // 3️⃣ Fallback – just the closest elevator irrespective of direction
        bestDist = Infinity;
        for (const e of elevators) {
            const dist = Math.abs(e.getCurrentFloor() - targetFloor);
            if (dist < bestDist) {
                bestDist = dist;
                bestId = e.getId();
            }
        }
        return bestId;
    }
}