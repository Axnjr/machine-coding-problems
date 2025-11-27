// models/building.ts
import { Floor } from "./floor";
import { Elevator } from "./elevator";
import { Controller } from "../services/controller";
import { SimpleElevatorScheduling } from "../services/algorithm";

/**
 * Building aggregates floors, elevators and the controller.
 * It provides a convenient way to spin up the whole system.
 */
export class Building {
    private floors: Floor[] = [];
    private elevators: Elevator[] = [];
    private controller: Controller;

    constructor(
        private totalFloors: number = 10,
        private totalElevators: number = 4
    ) {
        // create floors
        for (let i = 0; i < totalFloors; i++) {
            this.floors.push(new Floor(i));
        }
        // create elevators (all start at ground floor 0)
        for (let i = 0; i < totalElevators; i++) {
            this.elevators.push(new Elevator(0, i));
        }
        // initialise controller with a simple scheduler
        this.controller = new Controller(
            new SimpleElevatorScheduling(),
            totalFloors,
            totalElevators
        );
        // register floors & elevators with the controller
        this.floors.forEach((f) => this.controller.registerFloors(f));
        this.elevators.forEach((e) => this.controller.registerElevator(e));
    }

    /** Expose the controller so the user can start the simulation */
    getController(): Controller {
        return this.controller;
    }
}