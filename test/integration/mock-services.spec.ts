import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    setupRedisMock,
    clearRedisMock,
    getRedisMock,
    teardownRedisMock,
    setupMongooseMock,
    clearDatabase,
    teardownMongooseMock,
    setupRabbitMQMock,
    publishMessage,
    consumeMessage,
    clearQueues,
    setupEmailMock,
    sendEmail,
    getSentEmails,
    clearEmails,
    setupStorageMock,
    uploadFile,
    downloadFile,
    clearStorage,
} from '../../../src/testing/index.js';

describe('Mock Services Integration', () => {
    describe('Redis + Mongoose Integration', () => {
        beforeEach(async () => {
            setupRedisMock();
            await setupMongooseMock();
        });

        afterEach(async () => {
            await clearRedisMock();
            await teardownMongooseMock();
        });

        it('should work with both Redis and Mongoose', async () => {
            const redis = getRedisMock();
            await redis.set('test-key', 'test-value');

            const value = await redis.get('test-key');
            expect(value).toBe('test-value');
        });
    });

    describe('Email + Storage Integration', () => {
        beforeEach(() => {
            setupEmailMock();
            setupStorageMock();
        });

        afterEach(() => {
            clearEmails();
            clearStorage();
        });

        it('should send email and store file', () => {
            sendEmail({
                to: 'user@example.com',
                from: 'noreply@example.com',
                subject: 'File uploaded',
                body: 'Your file has been uploaded',
            });

            uploadFile('files/document.pdf', Buffer.from('content'));

            const emails = getSentEmails();
            const file = downloadFile('files/document.pdf');

            expect(emails).toHaveLength(1);
            expect(file).toBeDefined();
        });
    });

    describe('RabbitMQ + Email Integration', () => {
        beforeEach(() => {
            setupRabbitMQMock();
            setupEmailMock();
        });

        afterEach(() => {
            clearQueues();
            clearEmails();
        });

        it('should process queue and send email', () => {
            publishMessage('email-queue', {
                to: 'user@example.com',
                subject: 'Test',
                body: 'Test message',
            });

            const message = consumeMessage('email-queue');

            if (message) {
                sendEmail({
                    to: message.to,
                    from: 'noreply@example.com',
                    subject: message.subject,
                    body: message.body,
                });
            }

            const emails = getSentEmails();
            expect(emails).toHaveLength(1);
            expect(emails[0].to).toBe('user@example.com');
        });
    });
});
