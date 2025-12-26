/**
 * Mock Email service for testing
 */
export class MockEmailService {
    private sentEmails: any[] = [];

    async sendEmail(options: any): Promise<void> {
        this.sentEmails.push(options);
    }

    getSentEmails(): any[] {
        return this.sentEmails;
    }

    clear(): void {
        this.sentEmails = [];
    }
}

export function createMockEmail() {
    return new MockEmailService();
}
