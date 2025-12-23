import nodemailer from 'nodemailer';

export class EmailService {
    private static transporter: nodemailer.Transporter;

    /**
     * Initialize email service
     */
    static init() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT || '2525'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        console.log('✅ Email service initialized');
    }

    /**
     * Send email
     */
    static async send(data: {
        to: string;
        subject: string;
        body: string;
        template?: string;
        from?: string;
    }) {
        try {
            const info = await this.transporter.sendMail({
                from: data.from || process.env.EMAIL_FROM || 'noreply@example.com',
                to: data.to,
                subject: data.subject,
                text: data.body,
                html: this.renderTemplate(data.template, data.body),
            });

            console.log('✅ Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            throw error;
        }
    }

    /**
     * Send welcome email
     */
    static async sendWelcome(email: string, name: string) {
        return await this.send({
            to: email,
            subject: 'Welcome!',
            body: `Hello ${name}, welcome to our service!`,
            template: 'welcome',
        });
    }

    /**
     * Send password reset email
     */
    static async sendPasswordReset(email: string, token: string) {
        return await this.send({
            to: email,
            subject: 'Password Reset',
            body: `Click here to reset your password: ${process.env.APP_URL}/reset/${token}`,
            template: 'password-reset',
        });
    }

    /**
     * Render email template
     */
    private static renderTemplate(template: string | undefined, body: string): string {
        if (!template) {
            return `<p>${body}</p>`;
        }

        // Simple template rendering
        // In production, use a proper template engine
        return `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Notification</h2>
            <p>${body}</p>
            <hr />
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </body>
      </html>
    `;
    }
}
