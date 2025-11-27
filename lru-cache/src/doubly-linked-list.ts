import { INode } from './interfaces';
import { DLLNode } from './node';

export class DoublyLinkedList<K, V> {
    private head: INode<K, V> | null = null;
    private tail: INode<K, V> | null = null;
    private _size: number = 0;

    constructor() { }

    public addToHead(node: INode<K, V>): void {
        if (!this.head) {
            this.head = node;
            this.tail = node;
            node.next = null;
            node.prev = null;
        } else {
            node.next = this.head;
            node.prev = null;
            this.head.prev = node;
            this.head = node;
        }
        this._size++;
    }

    public remove(node: INode<K, V>): void {
        if (node.prev) {
            node.prev.next = node.next;
        } else {
            // Node is head
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            // Node is tail
            this.tail = node.prev;
        }

        node.prev = null;
        node.next = null;
        this._size--;
    }

    public removeTail(): INode<K, V> | null {
        if (!this.tail) {
            return null;
        }
        const nodeToRemove = this.tail;
        this.remove(nodeToRemove);
        return nodeToRemove;
    }

    public moveToHead(node: INode<K, V>): void {
        if (node === this.head) {
            return;
        }
        this.remove(node);
        this.addToHead(node);
    }

    public get size(): number {
        return this._size;
    }

    public clear(): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }
}
