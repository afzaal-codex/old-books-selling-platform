import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("===========================================");
console.log("EMAIL CONFIGURATION VERIFICATION");
console.log("===========================================");
console.log("Email Host:", process.env.EMAIL_HOST);
console.log("Email Port: 465 (SSL - hardcoded)");
console.log("Email User:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
console.log("Email Password:", process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing");
console.log("===========================================\n");

// NOTE: Port 587 (STARTTLS) was ETIMEDOUT (blocked by hosting firewall).
// Port 465 (SSL direct) is confirmed working — do NOT change back to 587.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error.message);
    console.log("   Code:", error.code);
    console.log("   Response:", error.response);
  } else {
    console.log("✅ SMTP READY - Email service is working on port 465 (SSL)");
  }
});

export default transporter;
