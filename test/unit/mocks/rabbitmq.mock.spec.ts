import { describe, it, expect, beforeEach } from 'vitest';
import {
    setupRabbitMQMock,
    publishMessage,
    consumeMessage,
    getQueueMessages,
    clearQueues,
    clearQueue,
    getQueueCount,
} from '../../../src/testing/mocks/rabbitmq.mock.js';

describe('RabbitMQ Mock', () => {
    beforeEach(() => {
        setupRabbitMQMock();
    });

    it('should publish and consume messages', () => {
        publishMessage('test-queue', { data: 'test message' });

        const message = consumeMessage('test-queue');
        expect(message).toEqual({ data: 'test message' });
    });

    it('should handle multiple messages', () => {
        publishMessage('test-queue', { id: 1 });
        publishMessage('test-queue', { id: 2 });
        publishMessage('test-queue', { id: 3 });

        expect(getQueueCount('test-queue')).toBe(3);
    });

    it('should consume messages in FIFO order', () => {
        publishMessage('test-queue', { id: 1 });
        publishMessage('test-queue', { id: 2 });

        const msg1 = consumeMessage('test-queue');
        const msg2 = consumeMessage('test-queue');

        expect(msg1.id).toBe(1);
        expect(msg2.id).toBe(2);
    });

    it('should return null for empty queue', () => {
        const message = consumeMessage('empty-queue');
        expect(message).toBeNull();
    });

    it('should get all queue messages', () => {
        publishMessage('test-queue', { id: 1 });
        publishMessage('test-queue', { id: 2 });

        const messages = getQueueMessages('test-queue');
        expect(messages).toHaveLength(2);
    });

    it('should clear specific queue', () => {
        publishMessage('queue1', { data: 'test' });
        publishMessage('queue2', { data: 'test' });

        clearQueue('queue1');

        expect(getQueueCount('queue1')).toBe(0);
        expect(getQueueCount('queue2')).toBe(1);
    });

    it('should clear all queues', () => {
        publishMessage('queue1', { data: 'test' });
        publishMessage('queue2', { data: 'test' });

        clearQueues();

        expect(getQueueCount('queue1')).toBe(0);
        expect(getQueueCount('queue2')).toBe(0);
    });
});
