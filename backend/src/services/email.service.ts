import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

/**
 * Service to handle email sending
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

/**
 * Generate a password reset email
 */
export const sendPasswordResetEmail = async (
  email: string, 
  resetToken: string
): Promise<void> => {
  // Create reset URL
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  // Create email content
  const message = `
    <h1>You requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    email,
    subject: 'Password Reset Request',
    message,
  });
}; 