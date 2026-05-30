import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("ENV TEST");
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:");
    console.log(error);
  } else {
    console.log("SMTP READY");
  }
});

export default transporter;