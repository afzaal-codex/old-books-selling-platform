import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// =========================================
// EMAIL CONFIGURATION
// =========================================

const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.hostinger.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 465;
const EMAIL_SECURE = EMAIL_PORT === 465;

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
 * Retries once after 3 seconds if the first attempt fails with
 * a connection/timeout error. Recreates the transporter on
 * connection-level failures before retrying.
 */
const sendMailWithRetry = async (mailOptions, maxRetries = 1) => {
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
