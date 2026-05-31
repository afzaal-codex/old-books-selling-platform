import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// =========================================
// EMAIL CONFIGURATION
// =========================================

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.hostinger.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 465;
const EMAIL_SECURE = EMAIL_PORT === 465;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log("===========================================");
console.log("EMAIL CONFIGURATION VERIFICATION");
console.log("===========================================");
console.log("Email Host:", EMAIL_HOST);
console.log("Email Port:", EMAIL_PORT, `(${EMAIL_SECURE ? "SSL" : "STARTTLS"} - dynamic)`);
console.log("Email User:", EMAIL_USER ? `✓ Set (${EMAIL_USER})` : "✗ Missing");
console.log("Email Password:", EMAIL_PASS ? "✓ Set" : "✗ Missing");
console.log("===========================================\n");

// =========================================
// CREATE TRANSPORTER
// =========================================

const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    family: 4,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 45000,
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    rateDelta: 2000,
    rateLimit: 5,
  });
};

let transporter = createTransporter();

// =========================================
// VERIFY CONNECTION
// =========================================

const verifyConnection = async () => {
  if (process.env.RESEND_API_KEY) {
    console.log("✅ EMAIL API READY - Using Resend HTTP API (port 443)");
    return true;
  }
  if (process.env.SENDGRID_API_KEY) {
    console.log("✅ EMAIL API READY - Using SendGrid HTTP API (port 443)");
    return true;
  }

  try {
    await transporter.verify();
    console.log(`✅ SMTP READY - Email service is working on port ${EMAIL_PORT} (${EMAIL_SECURE ? "SSL" : "STARTTLS"})`);
    return true;
  } catch (error) {
    console.log("❌ SMTP ERROR:", error.message);
    console.log("   Code:", error.code);
    console.log("   Command:", error.command);
    if (error.response) {
      console.log("   Response:", error.response);
    }
    return false;
  }
};

verifyConnection();

// =========================================
// SEND MAIL WITH RETRY
// =========================================

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends an email with automatic retry on transient failures.
 * If RESEND_API_KEY or SENDGRID_API_KEY is configured in the env,
 * it sends via HTTP API on port 443 to bypass firewall blocks.
 */
const sendMailWithRetry = async (mailOptions, maxRetries = 1) => {
  // If Resend API Key is configured, send via HTTP API on port 443
  if (process.env.RESEND_API_KEY) {
    console.log(`📡 Sending email to ${mailOptions.to} via Resend API (HTTPS)...`);
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: mailOptions.from || `"Book World" <onboarding@resend.dev>`,
          to: [mailOptions.to],
          subject: mailOptions.subject,
          html: mailOptions.html,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || JSON.stringify(data));
      }
      console.log(`✅ Email sent via Resend API | Id: ${data.id}`);
      return { messageId: data.id };
    } catch (apiError) {
      console.error(`❌ Resend API failed:`, apiError.message);
      throw apiError;
    }
  }

  // If SendGrid API Key is configured, send via HTTP API on port 443
  if (process.env.SENDGRID_API_KEY) {
    console.log(`📡 Sending email to ${mailOptions.to} via SendGrid API (HTTPS)...`);
    try {
      let fromEmail = process.env.EMAIL_USER || "hello@bookworld.site";
      let fromName = "Book World";
      if (mailOptions.from) {
        const match = mailOptions.from.match(/"([^"]+)"\s*<([^>]+)>/);
        if (match) {
          fromName = match[1];
          fromEmail = match[2];
        }
      }
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: mailOptions.to }] }],
          from: { email: fromEmail, name: fromName },
          subject: mailOptions.subject,
          content: [{ type: "text/html", value: mailOptions.html }],
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Status ${response.status}`);
      }
      console.log(`✅ Email sent via SendGrid API`);
      return { messageId: "sendgrid-success" };
    } catch (apiError) {
      console.error(`❌ SendGrid API failed:`, apiError.message);
      throw apiError;
    }
  }

  // Fallback to Nodemailer SMTP
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${mailOptions.to} | MessageId: ${result.messageId}`);
      return result;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Email send attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        error.message
      );
      console.error("   Code:", error.code);
      if (error.response) {
        console.error("   SMTP Response:", error.response);
      }
      if (error.command) {
        console.error("   Failed Command:", error.command);
      }

      // Determine if the error is retryable
      const retryableCodes = [
        "ECONNREFUSED",
        "ECONNRESET",
        "ETIMEDOUT",
        "ESOCKET",
        "ECONNECTION",
        "EPIPE",
      ];

      const isRetryable =
        retryableCodes.includes(error.code) ||
        error.message?.includes("connection") ||
        error.message?.includes("timeout") ||
        error.message?.includes("socket");

      if (attempt < maxRetries && isRetryable) {
        console.log(`   ⏳ Retrying in 3 seconds... (recreating transporter)`);
        // Recreate transporter to get a fresh connection
        transporter = createTransporter();
        await delay(3000);
      } else if (!isRetryable) {
        // Non-retryable error (e.g. auth failure, invalid recipient) — fail immediately
        break;
      }
    }
  }

  // All attempts failed
  throw lastError;
};

export { sendMailWithRetry };
export default transporter;
