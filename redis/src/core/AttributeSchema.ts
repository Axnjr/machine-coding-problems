import { AttributeType, type AttributeValue } from '../types';

export class AttributeSchema {
    private schema: Map<string, AttributeType> = new Map();

    public validateAndRegister(key: string, value: string): AttributeType {
        const inferredType = this.inferType(value);

        if (this.schema.has(key)) {
            const expectedType = this.schema.get(key);
            if (expectedType !== inferredType) {
                throw new Error('Data Type Error');
            }
        } else {
            this.schema.set(key, inferredType);
        }

        return inferredType;
    }

    public getType(key: string): AttributeType | undefined {
        return this.schema.get(key);
    }

    private inferType(value: string): AttributeType {
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            return AttributeType.BOOLEAN;
        }

        // Strict Integer check: only digits, optionally signed. No decimal point.
        if (/^-?\d+$/.test(value)) {
            return AttributeType.INTEGER;
        }

        // Strict Double check: digits, decimal point, digits.
        if (/^-?\d*\.\d+$/.test(value)) {
            return AttributeType.DOUBLE;
        }

        return AttributeType.STRING;
    }

    public parseValue(value: string, type: AttributeType): AttributeValue {
        switch (type) {
            case AttributeType.BOOLEAN:
                return value.toLowerCase() === 'true';
            case AttributeType.INTEGER:
                return parseInt(value, 10);
            case AttributeType.DOUBLE:
                return parseFloat(value);
            default:
                return value;
        }
    }
}
