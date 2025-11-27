import { Constants } from "../constants";

type Direction = "UP" | "DOWN" | "IDLE";

/**
 * Elevator model that supports:
 *  - per‑elevator internal request queue
 *  - tick‑based movement (one floor per tick)
 *  - simple door open/close handling
 *  - helper methods used by the scheduler
 */
export class Elevator {
    private currentFloor: number;
    private direction: Direction = "IDLE";
    private readonly id: number;
    private internalQueue: number[] = []; // floors requested from inside the car
    private doorOpen = false;
    private doorTimer = 0; // ticks while doors stay open

    constructor(startFloor: number, id: number) {
        this.currentFloor = startFloor;
        this.id = id;
    }

    /** Public getters */
    getId(): number {
        return this.id;
    }
    getCurrentFloor(): number {
        return this.currentFloor;
    }
    getDirection(): Direction {
        return this.direction;
    }

    /** Add a floor request that originated from inside the elevator */
    addInternalRequest(floor: number): void {
        if (!this.internalQueue.includes(floor)) this.internalQueue.push(floor);
    }

    /** Called by the controller when a hall request is assigned to this elevator */
    assignHallRequest(floor: number): void {
        if (!this.internalQueue.includes(floor)) this.internalQueue.push(floor);
    }

    /** One simulation tick – move at most one floor, handle doors */
    tick(): void {
        // If doors are open, just count down and do nothing else
        if (this.doorOpen) {
            this.doorTimer--;
            if (this.doorTimer <= 0) this.closeDoors();
            return;
        }

        // No pending destinations → stay idle
        if (this.internalQueue.length === 0) {
            this.direction = "IDLE";
            return;
        }

        const target = this.internalQueue[0];
        if (this.currentFloor === target) {
            // Arrived – open doors, remove request
            this.openDoors();
            this.internalQueue.shift();
            return;
        }

        // Move one floor towards the target
        // @ts-ignore
        if (this.currentFloor < target) {
            this.currentFloor++;
            this.direction = "UP";
        } else {
            this.currentFloor--;
            this.direction = "DOWN";
        }
    }

    /** Door handling – open for a single tick (configurable) */
    private openDoors(): void {
        this.doorOpen = true;
        this.doorTimer = 1; // stay open for 1 tick; adjust if you want longer dwell time
        console.log(`🚪 Elevator ${this.id} opened doors at floor ${this.currentFloor}`);
    }
    private closeDoors(): void {
        this.doorOpen = false;
        console.log(`🚪 Elevator ${this.id} closed doors`);
    }

    /** Helper used by the scheduler – distance to a floor (ignores direction) */
    distanceTo(floor: number): number {
        return Math.abs(this.currentFloor - floor);
    }
}
