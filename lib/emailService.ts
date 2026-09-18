import { Resend } from "resend";
import nodemailer from "nodemailer";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export function generateWelcomeEmailHtml(recipientEmail: string, appUrl: string = "https://fin-access-chi.vercel.app") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FinAccess Financial Signals</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #07080B;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #07080B;
      padding: 40px 16px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #0F1118;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      padding: 32px 36px 24px 36px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      background: linear-gradient(180deg, rgba(102, 58, 243, 0.12) 0%, rgba(15, 17, 24, 0) 100%);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(102, 58, 243, 0.2);
      border: 1px solid rgba(102, 58, 243, 0.4);
      color: #B6D9FC;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .body-content {
      padding: 32px 36px;
    }
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 12px 0;
      line-height: 1.35;
    }
    .lead {
      font-size: 14px;
      line-height: 1.6;
      color: #94A3B8;
      margin: 0 0 24px 0;
    }
    .card-list {
      margin: 24px 0;
    }
    .feature-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 12px;
    }
    .feature-title {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 0 4px 0;
    }
    .feature-desc {
      font-size: 12px;
      color: #8E9BAE;
      line-height: 1.5;
      margin: 0;
    }
    .cta-container {
      text-align: center;
      padding: 24px 0 12px 0;
    }
    .cta-button {
      display: inline-block;
      background: #663AF3;
      background: linear-gradient(135deg, #7C4DFF 0%, #663AF3 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 14px 28px;
      border-radius: 8px;
      letter-spacing: 0.02em;
      box-shadow: 0 4px 20px rgba(102, 58, 243, 0.4);
    }
    .footer {
      padding: 24px 36px;
      background-color: #0B0D13;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 11px;
      color: #64748B;
      line-height: 1.6;
    }
    .footer a {
      color: #94A3B8;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="badge">Institutional Signal • Active</div>
        <h1 class="logo-text">FinAccess</h1>
      </div>

      <!-- Content -->
      <div class="body-content">
        <h2 class="title">You're connected to Institutional Financial Intelligence</h2>
        <p class="lead">
          Hello, you're subscribed to <strong>FinAccess Financial Signals</strong>. We deliver institutional-grade debt solvency models, tax optimization telemetry, and cashflow signals directly to early-career professionals.
        </p>

        <div class="card-list">
          <div class="feature-card">
            <p class="feature-title">🎯 Real-Time Financial Health Engine</p>
            <p class="feature-desc">Dynamic scoring out of 100 based on your savings velocity, emergency runway, and debt burden without sharing your credit report with commercial marketers.</p>
          </div>

          <div class="feature-card">
            <p class="feature-title">🛡️ Debt Safety & DTI Protection</p>
            <p class="feature-desc">Algorithmic debt-to-income limits that evaluate whether new EMIs or credit card terms fit inside safe borrowing thresholds.</p>
          </div>

          <div class="feature-card">
            <p class="feature-title">🏛️ FY 2024-25 Tax & Deposit Simulators</p>
            <p class="feature-desc">Side-by-side comparison of Old vs New Tax Regimes (post-July 2024 Budget) and quarterly compounded Fixed/Recurring Deposit yield calculators.</p>
          </div>
        </div>

        <div class="cta-container">
          <a href="${appUrl}/dashboard" class="cta-button">Open Your Financial Dashboard &rarr;</a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 8px 0;">
          <strong>FinAccess Security Protocol:</strong> Zero upselling • No hard bureau pulls • Institutional privacy standard.
        </p>
        <p style="margin: 0;">
          Sent to <strong>${recipientEmail}</strong>. If you did not request this update, you can safely ignore this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; provider: string; error?: string }> {
  // Option 1: Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const sender = process.env.EMAIL_FROM || "FinAccess <onboarding@resend.dev>";
      
      const { data, error } = await resend.emails.send({
        from: sender,
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error("[FinAccess Email] Resend API Error:", error);
        return { success: false, provider: "resend", error: error.message };
      }

      console.log("[FinAccess Email] Sent successfully via Resend:", data?.id);
      return { success: true, provider: "resend" };
    } catch (err: any) {
      console.error("[FinAccess Email] Resend Exception:", err);
      return { success: false, provider: "resend", error: err?.message || "Unknown Resend error" };
    }
  }

  // Option 2: Standard SMTP / Gmail App Password
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const sender = process.env.EMAIL_FROM || `"FinAccess" <${process.env.SMTP_USER}>`;

      const info = await transporter.sendMail({
        from: sender,
        to: to,
        subject: subject,
        html: html,
      });

      console.log("[FinAccess Email] Sent successfully via SMTP:", info.messageId);
      return { success: true, provider: "smtp" };
    } catch (err: any) {
      console.error("[FinAccess Email] SMTP Exception:", err);
      return { success: false, provider: "smtp", error: err?.message || "Unknown SMTP error" };
    }
  }

  // Fallback mode (simulated)
  console.warn(
    `[FinAccess Email] No email credentials found (RESEND_API_KEY or SMTP_USER). Simulated welcome email to ${to}`
  );
  return {
    success: true,
    provider: "simulated_dev",
    error: "No email service credentials configured. Simulated email delivery.",
  };
}
