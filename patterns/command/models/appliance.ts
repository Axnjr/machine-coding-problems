export class Aplliance {
    private state: 'on' | 'off' = 'off'
    constructor(private type: string) {}
    switchOn() {
        this.state = 'on'
    }
    switchOff() {
        this.state = 'off'
    }
}