import { INode } from './interfaces';

export class DLLNode<K, V> implements INode<K, V> {
    key: K;
    value: V;
    prev: INode<K, V> | null = null;
    next: INode<K, V> | null = null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}
