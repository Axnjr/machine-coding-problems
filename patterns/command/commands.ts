import type { Aplliance } from "./models/appliance";

export interface Command {
    execute(): void
}

export class LightOnCommand implements Command {
    constructor(private light: Aplliance) {}
    execute(): void {
        this.light.switchOn()
    }
}

export class LightOffCommand implements Command {
    constructor(private light: Aplliance) {}
    execute(): void {
        this.light.switchOff()
    }
}