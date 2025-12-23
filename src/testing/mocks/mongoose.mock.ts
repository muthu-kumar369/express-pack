import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer | null = null;

/**
 * Sets up in-memory MongoDB for testing
 * 
 * @returns MongoMemoryServer instance
 * 
 * @example
 * ```typescript
 * import { setupMongooseMock } from 'express-pack/testing';
 * 
 * beforeAll(async () => {
 *   await setupMongooseMock();
 * });
 * ```
 * 
 * @category Testing
 */
export async function setupMongooseMock() {
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    }
    return mongoServer;
}

/**
 * Clears all collections in test database
 * 
 * @example
 * ```typescript
 * import { clearDatabase } from 'express-pack/testing';
 * 
 * afterEach(async () => {
 *   await clearDatabase();
 * });
 * ```
 * 
 * @category Testing
 */
export async function clearDatabase() {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}

/**
 * Tears down MongoDB mock
 * 
 * @example
 * ```typescript
 * import { teardownMongooseMock } from 'express-pack/testing';
 * 
 * afterAll(async () => {
 *   await teardownMongooseMock();
 * });
 * ```
 * 
 * @category Testing
 */
export async function teardownMongooseMock() {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
    }

    if (mongoServer) {
        await mongoServer.stop();
        mongoServer = null;
    }
}

/**
 * Gets the MongoDB connection URI
 * 
 * @returns MongoDB URI string
 * 
 * @category Testing
 */
export function getMongoUri(): string {
    return mongoServer?.getUri() || '';
}
