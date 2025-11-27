export type ListnerCallback<T> = (payload: T) => void;

export class Observer<T> {
    private listners: Set<ListnerCallback<T>> = new Set();
    subscribe(listner: ListnerCallback<T>) {
        this.listners.add(listner);
    }
    notify(payload: T) {
        this.listners.forEach(listner => listner(payload))
    }
}