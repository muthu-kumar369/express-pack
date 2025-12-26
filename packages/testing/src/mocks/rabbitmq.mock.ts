/**
 * Mock RabbitMQ for testing
 */
export class MockRabbitMQ {
    private queues: Map<string, any[]> = new Map();

    async publish(queue: string, message: any): Promise<void> {
        if (!this.queues.has(queue)) {
            this.queues.set(queue, []);
        }
        this.queues.get(queue)!.push(message);
    }

    async consume(queue: string): Promise<any[]> {
        return this.queues.get(queue) || [];
    }

    async clear(queue: string): Promise<void> {
        this.queues.delete(queue);
    }
}

export function createMockRabbitMQ() {
    return new MockRabbitMQ();
}
