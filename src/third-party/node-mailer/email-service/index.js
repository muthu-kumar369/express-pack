import EmailTransporter from "../transporter/index.js";
import EmailTemplates from "../../../config/email-template/index.js";

export class EmailService {
  static transporter = null;
  static defaultFrom = process?.env?.DEFAULT_EMAIL_FROM;

  // Singleton Pattern: Initialize only once
  static init() {
    if (!EmailService.transporter) {
      EmailService.transporter = EmailTransporter.create();
    }
  }

  /**
   * Get email template by name
   * @param {Object} params
   * @param {string} params.templateName - Template name (e.g., 'welcome', 'resetPassword')
   * @param {Object} params.templateParams - Parameters for rendering the template
   * @returns {Object} - The rendered template with subject and HTML content
   */
  static async getTemplate({ templateName, templateParams }) {
    return EmailTemplates?.[templateName]?.({ data: templateParams });
  }

  /**
   * Send email using a template
   * @param {Object} params
   * @param {string} params.to - Recipient email
   * @param {string} params.templateName - Template name (e.g., 'welcome', 'resetPassword')
   * @param {object} [params.templateParams={}] - Parameters for template rendering
   * @returns {Promise<Object>} - The response from nodemailer sendMail method
   */
  static async sendEmail({ to, templateName, templateParams = {} }) {
    if (!EmailService.transporter) {
      throw new Error("EmailService not initialized. Please initialize first.");
    }

    const { subject, html } = await EmailService.getTemplate({
      templateName,
      templateParams,
    });

    return EmailService.transporter.sendMail({
      from: EmailService.defaultFrom,
      to,
      subject,
      html,
    });
  }
}

/**
 * Initialize the EmailService (once in the application setup, such as app.js or server.js)
 * Example:
 * EmailService.initialize();
 */

/**
 * Now you can directly use the methods like this throughout your application:
 *
 * Example 1: Send an email
 * ```js
 * const response = await EmailService.sendEmail({
 *   to: 'recipient@example.com',  // Recipient email address
 *   templateName: 'welcome',  // Template name (e.g., 'welcome', 'resetPassword')
 *   templateParams: { name: 'John Doe', link: 'http://example.com' },  // Parameters for template rendering
 * });
 * console.log('Email sent:', response);
 * ```
 */
