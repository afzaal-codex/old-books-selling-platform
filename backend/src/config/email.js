import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("===========================================");
console.log("EMAIL CONFIGURATION VERIFICATION");
console.log("===========================================");
console.log("Email Host:", process.env.EMAIL_HOST);
console.log("Email Port:", process.env.EMAIL_PORT);
console.log("Email User:", process.env.EMAIL_USER ? "✓ Set" : "✗ Missing");
console.log("Email Password:", process.env.EMAIL_PASS ? "✓ Set" : "✗ Missing");
console.log("===========================================\n");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error.message);
    console.log("\nERROR DETAILS:");
    console.log("Code:", error.code);
    console.log("Response Code:", error.responseCode);
    console.log("\n📋 TROUBLESHOOTING STEPS:");
    console.log("1. Verify EMAIL_HOST in .env (currently: " + process.env.EMAIL_HOST + ")");
    console.log("2. Verify EMAIL_PORT in .env (currently: " + process.env.EMAIL_PORT + ")");
    console.log("3. Verify EMAIL_USER in .env (currently: " + (process.env.EMAIL_USER ? "set" : "not set") + ")");
    console.log("4. Verify EMAIL_PASS in .env (currently: " + (process.env.EMAIL_PASS ? "set" : "not set") + ")");
    console.log("5. Check if email credentials are correct");
    console.log("6. If using Gmail, enable 'Less Secure Apps' or use App Password");
    console.log("7. If using Hostinger, ensure SMTP credentials are correct");
  } else {
    console.log("✅ SMTP READY (Connection successful)");
    console.log("Email service is configured and working properly.\n");
  }
});

export default transporter;
