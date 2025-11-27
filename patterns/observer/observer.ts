export interface Observer {
    update(args: any): void
}

export class EmailObserver implements Observer {
    update(args: string) {
        console.log(args)
    }
}

