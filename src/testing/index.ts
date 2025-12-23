/**
 * Testing Utilities for express-pack
 * 
 * Provides utilities for testing Express applications built with express-pack
 * 
 * @example
 * ```typescript
 * import { createTestApp, createTestRequest } from 'express-pack/testing';
 * 
 * const app = await createTestApp();
 * const request = createTestRequest(app);
 * await request.get('/health').expect(200);
 * ```
 * 
 * @module testing
 */

export { createTestApp, type TestAppOptions } from './app/createTestApp.js';
export { createTestRequest, createAuthenticatedRequest } from './app/request.js';
export { generateTestToken, createTestUser } from './helpers/auth.js';

// Mock services
export {
    setupRedisMock,
    clearRedisMock,
    getRedisMock,
    teardownRedisMock
} from './mocks/redis.mock.js';

export {
    setupMongooseMock,
    clearDatabase,
    teardownMongooseMock,
    getMongoUri
} from './mocks/mongoose.mock.js';

export {
    setupRabbitMQMock,
    publishMessage,
    consumeMessage,
    getQueueMessages,
    clearQueues,
    clearQueue,
    getQueueCount
} from './mocks/rabbitmq.mock.js';

export {
    setupEmailMock,
    sendEmail,
    getSentEmails,
    getEmailsTo,
    getLastEmail,
    clearEmails,
    getEmailCount
} from './mocks/email.mock.js';

export {
    setupStorageMock,
    uploadFile,
    downloadFile,
    getFileMetadata,
    deleteFile,
    listFiles,
    fileExists,
    clearStorage,
    getStorageSize
} from './mocks/storage.mock.js';

