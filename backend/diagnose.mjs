import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

// =============================================
// EMAIL TEST
// =============================================
console.log("\n=== EMAIL DIAGNOSIS ===");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : "MISSING");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: parseInt(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

try {
  await transporter.verify();
  console.log("✅ SMTP CONNECTED SUCCESSFULLY");

  // Try to actually send a test email
  const result = await transporter.sendMail({
    from: `"Book World Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Test Email from Book World",
    html: "<h1>This is a test email</h1><p>Email is working!</p>",
  });
  console.log("✅ TEST EMAIL SENT:", result.messageId);
  console.log("   Accepted:", result.accepted);
  console.log("   Rejected:", result.rejected);

} catch(e) {
  console.log("❌ SMTP ERROR:", e.message);
  console.log("   Code:", e.code);
  console.log("   Response:", e.response);
  console.log("   ResponseCode:", e.responseCode);
  console.log("   Command:", e.command);
}

// =============================================
// CLOUDINARY TEST
// =============================================
console.log("\n=== CLOUDINARY DIAGNOSIS ===");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
  const result = await cloudinary.api.ping();
  console.log("✅ CLOUDINARY CONNECTED:", JSON.stringify(result));
} catch(e) {
  console.log("❌ CLOUDINARY ERROR:", e.message);
  console.log("   HTTP Code:", e.http_code);
  console.log("   Error:", JSON.stringify(e.error));
}

console.log("\n=== DONE ===");
