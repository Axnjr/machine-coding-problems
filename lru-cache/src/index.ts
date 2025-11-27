import { LRUCache } from './lru-cache';

const cache = new LRUCache<string, number>(3);

console.log("Adding a: 1");
cache.put("a", 1);
console.log("Adding b: 2");
cache.put("b", 2);
console.log("Adding c: 3");
cache.put("c", 3);

console.log("Cache size:", cache.size()); // Should be 3
console.log("Get a:", cache.get("a")); // Should be 1. 'a' moves to head. Order: a, c, b

console.log("Adding d: 4 (should evict b)");
cache.put("d", 4); // Evicts LRU, which is 'b' (since 'a' was just accessed)

console.log("Get b:", cache.get("b")); // Should be undefined
console.log("Get c:", cache.get("c")); // Should be 3
console.log("Get d:", cache.get("d")); // Should be 4
console.log("Get a:", cache.get("a")); // Should be 1

console.log("Current size:", cache.size());

// Test update
console.log("Updating c to 30");
cache.put("c", 30);
console.log("Get c:", cache.get("c")); // Should be 30

// Test clear
cache.clear();
console.log("Cleared cache. Size:", cache.size());
