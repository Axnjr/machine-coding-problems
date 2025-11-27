export interface ICache<K, V> {
    get(key: K): V | undefined;
    put(key: K, value: V): void;
    size(): number;
    clear(): void;
}

export interface INode<K, V> {
    key: K;
    value: V;
    prev: INode<K, V> | null;
    next: INode<K, V> | null;
}
