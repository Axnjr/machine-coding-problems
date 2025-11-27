export interface Queue {
    enQueue(floor: number): void
    deQueue(): void
    isEmpty(): boolean
    peek(): number
    size(): number
}

export class FifoQueue implements Queue {
    private floors: number[] = [];
    enQueue(floor: number) {
        this.floors.push(floor)
    }
    deQueue() {
        if (this.isEmpty()) return
        this.floors.shift()
    }
    isEmpty() {
        return this.size() == 0;
    }
    peek() {
        if (this.isEmpty()) return -1;
        return this.floors[0] ?? -1;
    }
    size() {
        return this.floors.length
    }
}