import { AttributeSchema } from './AttributeSchema';
import type { AttributeValue, KeyValueStore as IKeyValueStore } from '../types';

export class Entry {
    private attributes: Map<string, AttributeValue> = new Map();
    private rawAttributes: Map<string, string> = new Map();

    constructor(
        attributes: Map<string, AttributeValue>,
        rawAttributes: Map<string, string>
    ) {
        this.attributes = attributes;
        this.rawAttributes = rawAttributes;
    }

    public getAttribute(key: string): AttributeValue | undefined {
        return this.attributes.get(key);
    }

    public getRawAttributes(): Map<string, string> {
        return this.rawAttributes;
    }

    public toString(): string {
        const parts: string[] = [];
        for (const [key, val] of this.rawAttributes.entries()) {
            parts.push(`${key}: ${val}`);
        }
        return parts.join(', ');
    }
}

export class KeyValueStore implements IKeyValueStore {
    private store: Map<string, Entry> = new Map();
    private schema: AttributeSchema = new AttributeSchema();
    private invertedIndex: Map<string, Map<string, Set<string>>> = new Map();

    public get(key: string): any | null {
        return this.store.get(key) || null;
    }

    public put(key: string, attributes: Array<{ key: string, value: string }>): void {
        // First pass: Validate all types
        const typedAttributes = new Map<string, AttributeValue>();
        const rawAttributes = new Map<string, string>();

        for (const attr of attributes) {
            // This will throw if type mismatch
            const type = this.schema.validateAndRegister(attr.key, attr.value);
            const parsedValue = this.schema.parseValue(attr.value, type);

            typedAttributes.set(attr.key, parsedValue);
            rawAttributes.set(attr.key, attr.value);
        }

        // Remove old index entries if key exists
        if (this.store.has(key)) {
            this.removeFromIndex(key, this.store.get(key)!);
        }

        // Create new entry
        const entry = new Entry(typedAttributes, rawAttributes);
        this.store.set(key, entry);

        // Update index
        this.addToIndex(key, rawAttributes);
    }

    public delete(key: string): void {
        if (this.store.has(key)) {
            this.removeFromIndex(key, this.store.get(key)!);
            this.store.delete(key);
        }
    }

    public search(attributeKey: string, attributeValue: string): string[] {
        const valuesMap = this.invertedIndex.get(attributeKey);
        if (!valuesMap) return [];

        const keysSet = valuesMap.get(attributeValue);
        if (!keysSet) return [];

        return Array.from(keysSet).sort();
    }

    public keys(): string[] {
        return Array.from(this.store.keys()).sort();
    }

    private addToIndex(key: string, attributes: Map<string, string>) {
        for (const [attrKey, attrVal] of attributes.entries()) {
            if (!this.invertedIndex.has(attrKey)) {
                this.invertedIndex.set(attrKey, new Map());
            }
            const valuesMap = this.invertedIndex.get(attrKey)!;

            if (!valuesMap.has(attrVal)) {
                valuesMap.set(attrVal, new Set());
            }
            valuesMap.get(attrVal)!.add(key);
        }
    }

    private removeFromIndex(key: string, entry: Entry) {
        const attributes = entry.getRawAttributes();
        for (const [attrKey, attrVal] of attributes.entries()) {
            const valuesMap = this.invertedIndex.get(attrKey);
            if (valuesMap) {
                const keysSet = valuesMap.get(attrVal);
                if (keysSet) {
                    keysSet.delete(key);
                    if (keysSet.size === 0) {
                        valuesMap.delete(attrVal);
                    }
                }
                if (valuesMap.size === 0) {
                    this.invertedIndex.delete(attrKey);
                }
            }
        }
    }
}
