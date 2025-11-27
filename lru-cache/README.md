# LRU Cache Implementation

This is a TypeScript implementation of a Least Recently Used (LRU) Cache using Bun.
It follows SOLID principles and Object-Oriented Programming patterns.

## Structure

- `src/interfaces.ts`: Defines `ICache` and `INode` interfaces (Interface Segregation).
- `src/node.ts`: Implements the `DLLNode` class.
- `src/doubly-linked-list.ts`: Implements the `DoublyLinkedList` class for managing the order of elements (Single Responsibility).
- `src/lru-cache.ts`: Implements the `LRUCache` class using a Map and the Doubly Linked List.
- `src/index.ts`: Demo script showing usage.

## Usage

To run the demo:

```bash
bun src/index.ts
```

## Complexity

- `get(key)`: O(1) - Map lookup + O(1) list update.
- `put(key, value)`: O(1) - Map update/insert + O(1) list update/eviction.
