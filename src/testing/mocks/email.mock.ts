/**
 * Email Mock for Testing
 * 
 * Captures sent emails for testing purposes
 */

interface Email {
    to: string | string[];
    from: string;
    subject: string;
    body: string;
    html?: string;
    timestamp: number;
}

const sentEmails: Email[] = [];

/**
 * Sets up email mock
 * 
 * @example
 * ```typescript
 * import { setupEmailMock } from 'express-pack/testing';
 * 
 * beforeEach(() => {
 *   setupEmailMock();
 * });
 * ```
 * 
 * @category Testing
 */
export function setupEmailMock() {
    sentEmails.length = 0;
}

/**
 * Mocks sending an email
 * 
 * @param email - Email data
 * 
 * @example
 * ```typescript
 * import { sendEmail } from 'express-pack/testing';
 * 
 * sendEmail({
 *   to: 'user@example.com',
 *   from: 'noreply@example.com',
 *   subject: 'Welcome',
 *   body: 'Welcome to our app!'
 * });
 * ```
 * 
 * @category Testing
 */
export function sendEmail(email: Omit<Email, 'timestamp'>) {
    sentEmails.push({
        ...email,
        timestamp: Date.now(),
    });
}

/**
 * Gets all sent emails
 * 
 * @returns Array of sent emails
 * 
 * @category Testing
 */
export function getSentEmails(): Email[] {
    return [...sentEmails];
}

/**
 * Gets emails sent to a specific address
 * 
 * @param to - Recipient email address
 * @returns Array of emails
 * 
 * @category Testing
 */
export function getEmailsTo(to: string): Email[] {
    return sentEmails.filter(email => {
        if (Array.isArray(email.to)) {
            return email.to.includes(to);
        }
        return email.to === to;
    });
}

/**
 * Gets the last sent email
 * 
 * @returns Last email or null
 * 
 * @category Testing
 */
export function getLastEmail(): Email | null {
    return sentEmails[sentEmails.length - 1] || null;
}

/**
 * Clears all sent emails
 * 
 * @category Testing
 */
export function clearEmails() {
    sentEmails.length = 0;
}

/**
 * Gets count of sent emails
 * 
 * @returns Number of sent emails
 * 
 * @category Testing
 */
export function getEmailCount(): number {
    return sentEmails.length;
}
