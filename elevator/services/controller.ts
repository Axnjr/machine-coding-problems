import { Elevator } from "../models/elevator";
import { Floor } from "../models/floor";
import type { SchedulingAlgorithm } from "./algorithm";
import type { Queue } from "./queue";

/**
 * Main orchestrator for the elevator system.
 * Runs a discrete‑time simulation where each tick represents the elevator
 * moving one floor (or doors opening/closing).
 */
export class Controller {
    private elevators: Elevator[] = [];
    private floors: Floor[] = [];
    private hallQueue: Queue; // external up/down calls
    private readonly tickMs = 500; // simulation speed – 0.5 s per tick

    constructor(
        private algorithm: SchedulingAlgorithm,
        private totalFloor: number,
        private totalElevators: number
    ) {
        this.hallQueue = algorithm.queue;
        // initialise floors
        for (let i = 0; i < this.totalFloor; i++) {
            this.registerFloors(new Floor(i));
        }
        // initialise elevators (all start at ground floor 0)
        for (let i = 0; i < this.totalElevators; i++) {
            const e = new (require("../models/elevator").Elevator)(0, i);
            this.registerElevator(e);
        }
    }

    /** External request coming from a floor call button */
    handleIncomingRequest(floor: number, direction: "UP" | "DOWN"): void {
        // Store only the floor in the FIFO queue; direction will be recomputed later.
        this.hallQueue.enQueue(floor);
    }

    /** Start the async simulation loop */
    async start(): Promise<void> {
        console.log("🚀 Elevator simulation started");
        while (true) {
            // 1️⃣ Process any pending hall requests
            if (!this.hallQueue.isEmpty()) {
                const floor = this.hallQueue.peek();
                const dir: "UP" | "DOWN" = floor > 0 ? "UP" : "DOWN";
                const bestId = this.algorithm.findClosestElevator(this.elevators, floor, dir);
                const bestElev = this.getElevatorById(bestId);
                bestElev?.assignHallRequest(floor);
                this.hallQueue.deQueue();
            }

            // 2️⃣ Tick every elevator (move one floor, handle doors)
            for (const e of this.elevators) {
                e.tick();
            }

            // 3️⃣ Visualise state in console (optional)
            this.logState();

            // Wait for next tick
            await new Promise((res) => setTimeout(res, this.tickMs));
        }
    }

    /** Helper to log where each elevator currently is */
    private logState(): void {
        const lines = this.floors.map((f) => {
            const occupants = this.elevators
                .filter((e) => e.getCurrentFloor() === f.getFloorNumber())
                .map((e) => `E${e.getId()}`)
                .join(", ");
            return `Floor ${f.getFloorNumber()}: ${occupants || "—"}`;
        });
        console.clear();
        console.log(lines.join("\n"));
    }

    /** Registration helpers */
    registerElevator(elevator: Elevator): void {
        this.elevators.push(elevator);
    }
    registerFloors(floor: Floor): void {
        this.floors.push(floor);
    }

    /** Simple getters */
    getFloors(): Floor[] {
        return this.floors;
    }
    getElevators(): Elevator[] {
        return this.elevators;
    }
    getTotalFloor(): number {
        return this.totalFloor;
    }
    getElevatorCurrentFloor(ele: Elevator): number {
        return ele.getCurrentFloor();
    }
    getElevatorById(id: number): Elevator | undefined {
        return this.elevators.find((e) => e.getId() === id);
    }
}