import type { Command } from "./commands";

export class Executor {
    constructor(private command: Command) {}
    setCommand(com: Command) {
        this.command = com
    }
    pressButton() {
        console.log('Executing the command!')
        this.command.execute()
        console.log('Executed the command!')
    }
}