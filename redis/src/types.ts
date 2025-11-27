export type AttributeValue = string | number | boolean;

export enum AttributeType {
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    DOUBLE = 'DOUBLE',
    BOOLEAN = 'BOOLEAN'
}

export interface KeyValueStore {
    get(key: string): Record<string, AttributeValue> | null;
    put(key: string, attributes: Array<{ key: string, value: string }>): void;
    delete(key: string): void;
    search(attributeKey: string, attributeValue: string): string[];
    keys(): string[];
}
