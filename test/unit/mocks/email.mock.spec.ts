import { describe, it, expect, beforeEach } from 'vitest';
import {
    setupEmailMock,
    sendEmail,
    getSentEmails,
    getEmailsTo,
    getLastEmail,
    clearEmails,
    getEmailCount,
} from '../../../src/testing/mocks/email.mock.js';

describe('Email Mock', () => {
    beforeEach(() => {
        setupEmailMock();
    });

    it('should capture sent emails', () => {
        sendEmail({
            to: 'user@example.com',
            from: 'noreply@example.com',
            subject: 'Test Email',
            body: 'Test body',
        });

        expect(getEmailCount()).toBe(1);
    });

    it('should get all sent emails', () => {
        sendEmail({
            to: 'user1@example.com',
            from: 'noreply@example.com',
            subject: 'Email 1',
            body: 'Body 1',
        });

        sendEmail({
            to: 'user2@example.com',
            from: 'noreply@example.com',
            subject: 'Email 2',
            body: 'Body 2',
        });

        const emails = getSentEmails();
        expect(emails).toHaveLength(2);
    });

    it('should get emails by recipient', () => {
        sendEmail({
            to: 'user1@example.com',
            from: 'noreply@example.com',
            subject: 'Email 1',
            body: 'Body 1',
        });

        sendEmail({
            to: 'user2@example.com',
            from: 'noreply@example.com',
            subject: 'Email 2',
            body: 'Body 2',
        });

        const emails = getEmailsTo('user1@example.com');
        expect(emails).toHaveLength(1);
        expect(emails[0].to).toBe('user1@example.com');
    });

    it('should get last sent email', () => {
        sendEmail({
            to: 'user1@example.com',
            from: 'noreply@example.com',
            subject: 'Email 1',
            body: 'Body 1',
        });

        sendEmail({
            to: 'user2@example.com',
            from: 'noreply@example.com',
            subject: 'Email 2',
            body: 'Body 2',
        });

        const lastEmail = getLastEmail();
        expect(lastEmail?.to).toBe('user2@example.com');
    });

    it('should handle multiple recipients', () => {
        sendEmail({
            to: ['user1@example.com', 'user2@example.com'],
            from: 'noreply@example.com',
            subject: 'Bulk Email',
            body: 'Body',
        });

        const emails1 = getEmailsTo('user1@example.com');
        const emails2 = getEmailsTo('user2@example.com');

        expect(emails1).toHaveLength(1);
        expect(emails2).toHaveLength(1);
    });

    it('should clear emails', () => {
        sendEmail({
            to: 'user@example.com',
            from: 'noreply@example.com',
            subject: 'Test',
            body: 'Test',
        });

        clearEmails();

        expect(getEmailCount()).toBe(0);
    });
});
