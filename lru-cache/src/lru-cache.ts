import { ICache, INode } from './interfaces';
import { DLLNode } from './node';
import { DoublyLinkedList } from './doubly-linked-list';

export class LRUCache<K, V> implements ICache<K, V> {
    private readonly capacity: number;
    private map: Map<K, INode<K, V>>;
    private list: DoublyLinkedList<K, V>;

    constructor(capacity: number) {
        if (capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
        }
        this.capacity = capacity;
        this.map = new Map<K, INode<K, V>>();
        this.list = new DoublyLinkedList<K, V>();
    }

    public get(key: K): V | undefined {
        const node = this.map.get(key);
        if (!node) {
            return undefined;
        }
        // Move accessed node to head (most recently used)
        this.list.moveToHead(node);
        return node.value;
    }

    public put(key: K, value: V): void {
        const existingNode = this.map.get(key);

        if (existingNode) {
            // Update value and move to head
            existingNode.value = value;
            this.list.moveToHead(existingNode);
        } else {
            // Create new node
            const newNode = new DLLNode(key, value);

            if (this.map.size >= this.capacity) {
                // Evict least recently used (tail)
                const removedNode = this.list.removeTail();
                if (removedNode) {
                    this.map.delete(removedNode.key);
                }
            }

            this.list.addToHead(newNode);
            this.map.set(key, newNode);
        }
    }

    public size(): number {
        return this.map.size;
    }

    public clear(): void {
        this.map.clear();
        this.list.clear();
    }
}
