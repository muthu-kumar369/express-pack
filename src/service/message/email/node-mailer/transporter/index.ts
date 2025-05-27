import nodemailer, { Transporter } from "nodemailer";

export class NodeMailerTransporter {
  static create(): Transporter {
    return nodemailer.createTransport({
      host: process?.env?.SMTP_HOST,
      port: process?.env?.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process?.env?.SMTP_SECURE === "true",
      auth: {
        user: process?.env?.SMTP_USER,
        pass: process?.env?.SMTP_PASS,
      },
    });
  }
}
