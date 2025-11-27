import type { Observer } from "./observer";

export class Publisher {
    private observers: Observer[] = [];
    constructor() {}
    addObserver(obs: Observer) {
        this.observers.push(obs)
    }
    testObservers() {
        console.log('Test function executed, notifying observers!')
        this.notify('test ran succesfully!')
    }
    notify(args: any) {
        this.observers.forEach(o => o.update(args))
    }
}