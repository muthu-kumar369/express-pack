/**
 * RabbitMQ Mock for Testing
 * 
 * Provides a simple in-memory message queue for testing
 */

interface Message {
    content: any;
    timestamp: number;
}

const queues: Map<string, Message[]> = new Map();
const exchanges: Map<string, Map<string, string[]>> = new Map();

/**
 * Sets up RabbitMQ mock
 * 
 * @example
 * ```typescript
 * import { setupRabbitMQMock } from 'express-pack/testing';
 * 
 * beforeEach(() => {
 *   setupRabbitMQMock();
 * });
 * ```
 * 
 * @category Testing
 */
export function setupRabbitMQMock() {
    queues.clear();
    exchanges.clear();
}

/**
 * Publishes a message to a queue
 * 
 * @param queue - Queue name
 * @param message - Message content
 * 
 * @category Testing
 */
export function publishMessage(queue: string, message: any) {
    if (!queues.has(queue)) {
        queues.set(queue, []);
    }

    queues.get(queue)!.push({
        content: message,
        timestamp: Date.now(),
    });
}

/**
 * Consumes a message from a queue
 * 
 * @param queue - Queue name
 * @returns Message content or null
 * 
 * @category Testing
 */
export function consumeMessage(queue: string): any | null {
    const queueMessages = queues.get(queue);
    if (!queueMessages || queueMessages.length === 0) {
        return null;
    }

    const message = queueMessages.shift();
    return message?.content || null;
}

/**
 * Gets all messages in a queue
 * 
 * @param queue - Queue name
 * @returns Array of messages
 * 
 * @category Testing
 */
export function getQueueMessages(queue: string): any[] {
    return (queues.get(queue) || []).map(m => m.content);
}

/**
 * Clears all queues
 * 
 * @category Testing
 */
export function clearQueues() {
    queues.clear();
}

/**
 * Clears a specific queue
 * 
 * @param queue - Queue name
 * 
 * @category Testing
 */
export function clearQueue(queue: string) {
    queues.delete(queue);
}

/**
 * Gets queue count
 * 
 * @param queue - Queue name
 * @returns Number of messages in queue
 * 
 * @category Testing
 */
export function getQueueCount(queue: string): number {
    return queues.get(queue)?.length || 0;
}
