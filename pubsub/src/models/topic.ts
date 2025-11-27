export type GenericTopicListner<T> = (payload: T) => void

export class Topic<T> {
    public id: string
    private _listners: GenericTopicListner<T>[] = []
    constructor(public name: string, public desc: string) {
        this.id = crypto.randomUUID()
    }
    subscribe(listner: GenericTopicListner<T>) {
        this._listners.push(listner)
    }
    notify(payload: T) {
        this._listners.forEach(listner => listner(payload))
    }
}