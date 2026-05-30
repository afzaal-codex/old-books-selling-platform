```js id="bh73ks"
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

  tls: {
    rejectUnauthorized: false,
  },

  connectionTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

export default transporter;
```
