/**
 * Mock Mongoose for testing
 */
export class MockMongoose {
    private collections: Map<string, any[]> = new Map();

    async save(collection: string, doc: any): Promise<any> {
        if (!this.collections.has(collection)) {
            this.collections.set(collection, []);
        }
        this.collections.get(collection)!.push(doc);
        return doc;
    }

    async find(collection: string, query: any = {}): Promise<any[]> {
        return this.collections.get(collection) || [];
    }

    async clear(collection: string): Promise<void> {
        this.collections.delete(collection);
    }
}

export function createMockMongoose() {
    return new MockMongoose();
}
