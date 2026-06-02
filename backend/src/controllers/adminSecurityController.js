import bcrypt from "bcryptjs";
import AdminOtp from "../models/AdminOtp.js";
import User from "../models/User.js";
import { sendBrandedEmail } from "../services/mailService.js";
import { updateEnvValue } from "../utils/envHelper.js";

const getAdminEmail = (req) => (req.user?.email || process.env.ADMIN_EMAIL || "").trim().toLowerCase();

const createSixDigits = () => String(Math.floor(100000 + Math.random() * 900000));
const createMatchNumber = () => String(Math.floor(Math.random() * 99) + 1);

const sendAdminOtp = async (req, res) => {
  const purpose = req.body.purpose || "cms-update";
  if (!["cms-update", "admin-password"].includes(purpose)) {
    return res.status(400).json({ success: false, message: "Invalid OTP purpose" });
  }

  const email = getAdminEmail(req);
  const otp = createSixDigits();
  const matchNumber = createMatchNumber();

  await AdminOtp.deleteMany({ email, purpose });
  await AdminOtp.create({
    email,
    purpose,
    otp,
    matchNumber,
    isVerifiedMatch: false,
    otpExpire: new Date(Date.now() + 10 * 60 * 1000),
  });

  const fake1 = createMatchNumber();
  let fake2 = createMatchNumber();
  while (fake2 === fake1) {
    fake2 = createMatchNumber();
  }

  const finalFake1 = fake1 === matchNumber ? String((Number(fake1) % 99) + 1) : fake1;
  let finalFake2 = fake2 === matchNumber ? String((Number(fake2) % 99) + 1) : fake2;
  while (finalFake2 === finalFake1) {
    finalFake2 = String((Number(finalFake2) % 99) + 1);
  }

  const options = [matchNumber, finalFake1, finalFake2].sort(() => Math.random() - 0.5);

  const host = req.protocol + "://" + req.get("host");
  const link1 = `${host}/api/cms/verify-match?email=${encodeURIComponent(email)}&purpose=${purpose}&number=${options[0]}`;
  const link2 = `${host}/api/cms/verify-match?email=${encodeURIComponent(email)}&purpose=${purpose}&number=${options[1]}`;
  const link3 = `${host}/api/cms/verify-match?email=${encodeURIComponent(email)}&purpose=${purpose}&number=${options[2]}`;

  await sendBrandedEmail({
    to: email,
    subject: purpose === "admin-password" ? "Admin Password Change Verification" : "CMS Settings Update Verification",
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #c8860a; border-radius: 12px; background-color: #0c0c0e; color: #fff;">
        <h2 style="color: #c8860a; text-align: center; margin-bottom: 20px;">BookWorld Security Verification</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #ccc;">You requested an administrative action. Please confirm this action by clicking the matching number shown on your Admin Panel to reveal your 6-digit OTP code:</p>
        
        <div style="margin: 30px 0; display: flex; gap: 12px; justify-content: center; text-align: center;">
          <a href="${link1}" style="display: inline-block; padding: 12px 24px; background-color: #c8860a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 0 10px 10px 0;">${options[0]}</a>
          <a href="${link2}" style="display: inline-block; padding: 12px 24px; background-color: #c8860a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 0 10px 10px 0;">${options[1]}</a>
          <a href="${link3}" style="display: inline-block; padding: 12px 24px; background-color: #c8860a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px;">${options[2]}</a>
        </div>
        
        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">This security code will expire in 10 minutes. If you did not make this request, please secure the admin credentials immediately.</p>
      </div>
    `,
  });

  res.json({ success: true, message: "OTP verification mail sent", matchNumber });
};

const verifyMatchClick = async (req, res) => {
  const { email, purpose, number } = req.query;

  if (!email || !purpose || !number) {
    return res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #d32f2f;">Invalid Request</h1>
        <p>Missing required parameters for verification.</p>
      </div>
    `);
  }

  try {
    const record = await AdminOtp.findOne({ email: email.toLowerCase(), purpose });
    if (!record) {
      return res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #d32f2f;">Link Expired</h1>
          <p>No active verification request found or the request has expired.</p>
        </div>
      `);
    }

    if (record.otpExpire < new Date()) {
      await AdminOtp.deleteMany({ email: email.toLowerCase(), purpose });
      return res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #d32f2f;">Link Expired</h1>
          <p>This verification link has expired. Please request a new OTP.</p>
        </div>
      `);
    }

    if (record.matchNumber !== String(number)) {
      return res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #0a0a0b; color: #fff; padding: 50px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box;">
          <div style="border: 1px solid #d32f2f; border-radius: 16px; padding: 40px; background-color: #141416; max-width: 500px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
            <h1 style="color: #f44336; font-size: 28px; margin-bottom: 20px; font-weight: 850;">Verification Failed</h1>
            <p style="font-size: 15px; color: #ccc; line-height: 1.6;">Incorrect matching number selected. Please click the correct number shown on your Admin Panel.</p>
          </div>
        </div>
      `);
    }

    record.isVerifiedMatch = true;
    await record.save();

    if (purpose === "admin-login") {
      await sendBrandedEmail({
        to: email,
        subject: "Your Admin Login OTP Code",
        bodyHtml: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #c8860a; border-radius: 12px; background-color: #0c0c0e; color: #fff;">
            <h2 style="color: #c8860a; text-align: center; margin-bottom: 20px;">BookWorld Admin Security OTP</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #ccc;">Your matching number has been verified successfully. Here is your 6-digit OTP code to complete your login:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: 950; color: #fff; letter-spacing: 5px; padding: 15px 30px; background: #0c0c0e; border: 2px dashed #c8860a; border-radius: 10px; display: inline-block;">
                ${record.otp}
              </span>
            </div>
            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">This OTP will expire in 10 minutes. If you did not initiate this login, please change your password immediately.</p>
          </div>
        `
      });
    }

    return res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #0c0c0e; color: #fff; padding: 50px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; box-sizing: border-box;">
        <div style="border: 1px solid #c8860a; border-radius: 16px; padding: 40px; background-color: #141416; max-width: 500px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
          <h1 style="color: #c8860a; font-size: 28px; margin-bottom: 20px; font-weight: 850;">Number Matched!</h1>
          <p style="font-size: 15px; color: #ccc; line-height: 1.6; margin-bottom: 24px;">Verification successful! Here is your 6-digit OTP code to complete the request:</p>
          <div style="font-size: 40px; font-weight: 900; color: #fff; letter-spacing: 4px; padding: 15px; background: #0c0c0e; border: 1px dashed #c8860a; border-radius: 10px; margin-bottom: 24px;">${record.otp}</div>
          <p style="font-size: 13px; color: #888;">Please enter this code in your Admin Panel to authorize the change.</p>
        </div>
      </div>
    `);
  } catch (error) {
    return res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #d32f2f;">Server Error</h1>
        <p>${error.message}</p>
      </div>
    `);
  }
};

const verifyAdminOtp = async ({ email, purpose, otp }) => {
  const record = await AdminOtp.findOne({ email, purpose });
  if (!record) throw new Error("OTP not found. Please request a new OTP.");
  if (record.otpExpire < new Date()) throw new Error("OTP expired. Please request a new OTP.");
  if (!record.isVerifiedMatch) {
    throw new Error("Please click the matching number link in your email first to verify.");
  }
  if (record.otp !== otp) throw new Error("Invalid OTP code.");
  await AdminOtp.deleteMany({ email, purpose });
};

const changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword, otp } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword || !otp) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  const email = getAdminEmail(req);
  try {
    await verifyAdminOtp({ email, purpose: "admin-password", otp });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }

  const admin = await User.findOne({ email }).select("+password");
  if (!admin) return res.status(404).json({ success: false, message: "Admin user not found" });

  const currentOk = await admin.matchPassword(currentPassword);
  if (!currentOk) return res.status(401).json({ success: false, message: "Current password is incorrect" });

  admin.password = newPassword;
  await admin.save();

  // Sync password change to .env
  updateEnvValue("ADMIN_PASSWORD", newPassword);

  res.json({ success: true, message: "Admin password changed successfully" });
};

const changeAdminEmail = async (req, res) => {
  const { newEmail, confirmEmail, otp } = req.body;
  if (!newEmail || !confirmEmail || !otp) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  if (newEmail.toLowerCase().trim() !== confirmEmail.toLowerCase().trim()) {
    return res.status(400).json({ success: false, message: "Emails do not match" });
  }

  const email = getAdminEmail(req);
  try {
    await verifyAdminOtp({ email, purpose: "cms-update", otp });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }

  const admin = await User.findOne({ email });
  if (!admin) return res.status(404).json({ success: false, message: "Admin user not found" });

  admin.email = newEmail.toLowerCase().trim();
  await admin.save();

  // Sync email change to .env
  updateEnvValue("ADMIN_EMAIL", newEmail.toLowerCase().trim());

  res.json({ success: true, message: "Admin email changed successfully" });
};

const updateAdminProfile = async (req, res) => {
  const { name, phone } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  const email = getAdminEmail(req);
  const admin = await User.findOne({ email });
  if (!admin) return res.status(404).json({ success: false, message: "Admin user not found" });

  admin.name = name;
  if (phone !== undefined) {
    admin.phone = phone;
  }
  await admin.save();

  // Sync to .env
  updateEnvValue("ADMIN_NAME", name);

  res.json({
    success: true,
    message: "Admin profile updated successfully",
    admin: { name: admin.name, phone: admin.phone }
  });
};

export { sendAdminOtp, verifyAdminOtp, verifyMatchClick, changeAdminPassword, changeAdminEmail, updateAdminProfile };
