// ============================================
// Mailer Configuration
// ============================================
// Sets up the SMTP transporter used to send
// password reset emails.
// ============================================

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for port 465, false for 587 (STARTTLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// ── Send Password Reset Email ─────────────────────────
export async function sendPasswordResetEmail(
    toEmail: string,
    userName: string,
    resetLink: string
) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: toEmail,
        subject: 'Reset your SpendWise password',
        html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px;">💰</span>
            <span style="font-size: 20px; font-weight: 600; color: #0F172A;">SpendWise</span>
          </div>
        </div>

        <div style="background: #F8FAFC; border-radius: 16px; padding: 32px 24px; text-align: center;">
          <h2 style="font-size: 18px; color: #0F172A; margin-bottom: 8px;">
            Reset your password
          </h2>
          <p style="font-size: 14px; color: #64748B; line-height: 1.6; margin-bottom: 24px;">
            Hi ${userName}, we received a request to reset your password.
            This link expires in 15 minutes.
          </p>

          <a href="${resetLink}"
             style="display: inline-block; background: #6366F1; color: white;
                    padding: 12px 32px; border-radius: 8px; text-decoration: none;
                    font-weight: 500; font-size: 14px;">
            Reset Password
          </a>

          <p style="font-size: 12px; color: #94A3B8; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>

        <p style="text-align: center; font-size: 11px; color: #CBD5E1; margin-top: 20px;">
          SpendWise — Personal Finance Tracker for Sri Lankan Students
        </p>
      </div>
    `,
    })
}