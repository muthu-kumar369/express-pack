/**
 * Mock S3 storage for testing
 */
export class MockS3Storage {
    private files: Map<string, any> = new Map();

    async upload(key: string, data: any): Promise<void> {
        this.files.set(key, data);
    }

    async download(key: string): Promise<any> {
        return this.files.get(key);
    }

    async delete(key: string): Promise<void> {
        this.files.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        return this.files.has(key);
    }

    clear(): void {
        this.files.clear();
    }
}

export function createMockStorage() {
    return new MockS3Storage();
}
