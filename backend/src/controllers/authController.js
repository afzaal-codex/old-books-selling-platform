import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import AdminOtp from "../models/AdminOtp.js";
import OTP from "../models/Otp.js";

import sendEmail, { sendBrandedEmail } from "../services/mailService.js";
import { getBrandedEmailTemplate } from "../utils/emailTemplate.js";
import { updateEnvValue } from "../utils/envHelper.js";


import {
  OAuth2Client,
} from "google-auth-library";

// =========================================
// GOOGLE CLIENT
// =========================================

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// =========================================
// GENERATE JWT TOKEN
// =========================================

const generateToken = (
  id,
  isAdmin = false
) => {
  return jwt.sign(
    {
      id,
      isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

// =========================================
// REGISTER USER
// =========================================

export const registerUser = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    // EMPTY FIELDS
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    // EMAIL FORMAT
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email format",
      });
    }

    // PASSWORD LENGTH
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // EXISTING USER
    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already registered",
      });
    }

    // CREATE USER
    const user = await User.create({
  name,
  email,
  phone,
  password,

  isVerified: true,

  lastActiveAt:
    new Date(),

  isInactive: false,
});

    // ADMIN CHECK
    const isAdmin =
      email === process.env.ADMIN_EMAIL;

    // TOKEN
    const token = generateToken(
      user._id,
      isAdmin
    );

    res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      token,
      isAdmin,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =========================================
// LOGIN USER
// =========================================

export const loginUser = async (
  req,
  res
) => {
  try {

    const { email, password, otp } =
      req.body;

    // EMPTY FIELDS
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // FIND USER
    const user =
      await User.findOne({
        email,
      });

    // USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    // BLOCKED USER
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been blocked",
      });
    }

    // INACTIVE USER
if (user.isInactive) {
  return res.status(403).json({
    success: false,
    message:
      "Your account is inactive due to long inactivity",
  });
}

    // EMAIL NOT VERIFIED
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }

    // PASSWORD CHECK
    const isMatch =
      await user.matchPassword(
        password
      );

    // INVALID PASSWORD
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // UPDATE LAST ACTIVITY
user.lastActiveAt =
  new Date();

user.isInactive = false;

await user.save();

    // ADMIN CHECK
    const isAdmin = user.isAdmin === true;

    if (isAdmin) {
      if (!otp) {
        const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        const matchNumber = String(Math.floor(Math.random() * 99) + 1);
        const purpose = "admin-login";

        await AdminOtp.deleteMany({ email: user.email, purpose });
        await AdminOtp.create({
          email: user.email,
          purpose,
          otp: generatedOtp,
          matchNumber,
          isVerifiedMatch: false,
          otpExpire: new Date(Date.now() + 10 * 60 * 1000),
        });

        const fake1 = String(Math.floor(Math.random() * 99) + 1);
        let fake2 = String(Math.floor(Math.random() * 99) + 1);
        while (fake2 === fake1) {
          fake2 = String(Math.floor(Math.random() * 99) + 1);
        }
        const finalFake1 = fake1 === matchNumber ? String((Number(fake1) % 99) + 1) : fake1;
        let finalFake2 = fake2 === matchNumber ? String((Number(fake2) % 99) + 1) : fake2;
        while (finalFake2 === finalFake1) {
          finalFake2 = String((Number(finalFake2) % 99) + 1);
        }
        const options = [matchNumber, finalFake1, finalFake2].sort(() => Math.random() - 0.5);

        const host = req.protocol + "://" + req.get("host");
        const link1 = `${host}/api/cms/verify-match?email=${encodeURIComponent(user.email)}&purpose=${purpose}&number=${options[0]}`;
        const link2 = `${host}/api/cms/verify-match?email=${encodeURIComponent(user.email)}&purpose=${purpose}&number=${options[1]}`;
        const link3 = `${host}/api/cms/verify-match?email=${encodeURIComponent(user.email)}&purpose=${purpose}&number=${options[2]}`;

        await sendBrandedEmail({
          to: user.email,
          subject: "Admin Login Verification",
          bodyHtml: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #c8860a; border-radius: 12px; background-color: #0c0c0e; color: #fff;">
              <h2 style="color: #c8860a; text-align: center; margin-bottom: 20px;">BookWorld Admin Login Security</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #ccc;">A login attempt was detected. Please confirm this action by clicking the matching number shown on your login screen to reveal your 6-digit OTP code:</p>
              
              <div style="margin: 30px 0; display: flex; gap: 12px; justify-content: center; text-align: center;">
                <a href="${link1}" style="display: inline-block; padding: 12px 24px; background-color: #c8860a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 0 10px 10px 0;">${options[0]}</a>
                <a href="${link2}" style="display: inline-block; padding: 12px 24px; background-color: #c8860a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 0 10px 10px 0;">${options[1]}</a>
                <a href="${link3}" style="display: inline-block; padding: 12px 24px; background-color: #c8860a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px;">${options[2]}</a>
              </div>
              
              <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">This security code will expire in 10 minutes. If you did not make this request, please secure the admin credentials immediately.</p>
            </div>
          `,
        });

        return res.status(200).json({
          success: true,
          requiresOtp: true,
          matchNumber,
          email: user.email,
          message: "Admin verification required. OTP matching number has been sent to your email."
        });
      } else {
        const record = await AdminOtp.findOne({ email: user.email, purpose: "admin-login" });
        if (!record) {
          return res.status(401).json({ success: false, message: "OTP not found or expired. Please try logging in again." });
        }
        if (record.otpExpire < new Date()) {
          await AdminOtp.deleteMany({ email: user.email, purpose: "admin-login" });
          return res.status(401).json({ success: false, message: "OTP expired. Please try logging in again." });
        }
        if (!record.isVerifiedMatch) {
          return res.status(401).json({ success: false, message: "Please click the matching number link in your email first." });
        }
        if (record.otp !== otp) {
          return res.status(401).json({ success: false, message: "Invalid OTP code." });
        }
        await AdminOtp.deleteMany({ email: user.email, purpose: "admin-login" });
      }
    }

    // TOKEN
    const token = generateToken(
      user._id,
      isAdmin
    );

    res.status(200).json({
      success: true,

      message: isAdmin
        ? "Admin login successful"
        : "Login successful",

      token,

      isAdmin,

      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =========================================
// SEND SIGNUP OTP
// =========================================

export const sendSignupOTP = async (
  req,
  res
) => {
  try {

    const { email } = req.body;

    // EMAIL REQUIRED
    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
      });
    }

    // EMAIL FORMAT
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email format",
      });
    }

    // EXISTING USER
    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already registered",
      });
    }

    // GENERATE OTP
    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();

    // DELETE OLD OTP
    await OTP.deleteMany({
      email,
    });

    // CREATE OTP
    await OTP.create({
      email,

      otp,

      otpExpire:
        Date.now() +
        10 * 60 * 1000,
    });

    // SEND EMAIL
    const otpBody = `
      <h2 style="color: #d4af37; font-size: 20px; margin-top: 0;">Verify Your Email</h2>
      <p>Hello,</p>
      <p>Thank you for registering with Book World. Your secure verification code is:</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="letter-spacing: 5px; font-size: 32px; font-weight: 900; color: #d4af37; background-color: #111111; padding: 12px 24px; border: 1px solid #d4af37; border-radius: 8px; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p>This verification OTP is highly confidential and will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not request this verification, please ignore this email or contact support.</p>
    `;

    await sendBrandedEmail({
      to: email,
      subject: "Email Verification OTP",
      bodyHtml: otpBody,
    });

    res.status(200).json({
      success: true,
      message:
        "OTP sent successfully",
    });

  } catch (error) {

    console.error("SendSignupOTP Error:", error.message, error.code || "");

    res.status(500).json({
      success: false,
      message:
        "Failed to send OTP. Please try again later.",
    });
  }
};

// =========================================
// VERIFY SIGNUP OTP
// =========================================

export const verifySignupOTP = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      otp,
    } = req.body;

    // REQUIRED FIELDS
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    // PASSWORD LENGTH
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // FIND OTP
    const otpRecord =
      await OTP.findOne({
        email,
      });

    // OTP NOT FOUND
    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message:
          "OTP not found",
      });
    }

    // INVALID OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });
    }

    // OTP EXPIRED
    if (
      otpRecord.otpExpire <
      Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "OTP expired",
      });
    }

    // CREATE USER
   const user = await User.create({
  name,

  email,

  phone,

  password,

  isVerified: true,

  lastActiveAt:
    new Date(),

  isInactive: false,
});

    // DELETE OTP
    await OTP.deleteMany({
      email,
    });

    // ADMIN CHECK
    const isAdmin = user.isAdmin === true;

    // TOKEN
    const token = generateToken(
      user._id,
      isAdmin
    );

    res.status(201).json({
      success: true,

      message:
        "Email verified successfully",

      token,

      isAdmin,

      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =========================================
// GOOGLE LOGIN
// =========================================

export const googleLogin = async (
  req,
  res
) => {
  try {

    const { token } = req.body;

    // VERIFY GOOGLE TOKEN
    const ticket =
      await client.verifyIdToken({
        idToken: token,

        audience:
          process.env.GOOGLE_CLIENT_ID,
      });

    const payload =
      ticket.getPayload();

    const {
      sub,
      name,
      email,
      email_verified,
    } = payload;

    // EMAIL VERIFIED
    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message:
          "Google email not verified",
      });
    }

    // FIND USER
    let user =
      await User.findOne({
        email,
      });

    // CREATE USER
    if (!user) {

     user = await User.create({
  name,

  email,

  googleId: sub,

  authProvider:
    "google",

  isVerified: true,

  password:
    crypto
      .randomBytes(16)
      .toString("hex"),

  lastActiveAt:
    new Date(),

  isInactive: false,
});
    }
// INACTIVE USER
if (user.isInactive) {
  return res.status(403).json({
    success: false,
    message:
      "Your account is inactive due to long inactivity",
  });
}
// UPDATE LAST ACTIVITY
user.lastActiveAt =
  new Date();

user.isInactive = false;

await user.save();
    // ADMIN CHECK
    const isAdmin = user.isAdmin === true;

    // JWT TOKEN
    const jwtToken =
      generateToken(
        user._id,
        isAdmin
      );

    res.status(200).json({
      success: true,

      message:
        "Google login successful",

      token: jwtToken,

      isAdmin,

      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Google login failed",
    });
  }
};

// =========================================
// FORGOT PASSWORD
// =========================================

export const forgotPassword = async (
  req,
  res
) => {
  try {

    const { email } = req.body;

    // EMAIL REQUIRED
    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required",
      });
    }

    // FIND USER
    const user =
      await User.findOne({
        email,
      });

    // USER NOT FOUND
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    // GENERATE TOKEN
    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    // SAVE TOKEN
    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpire =
      Date.now() +
      15 * 60 * 1000;

    await user.save();

    // RESET URL
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // SEND EMAIL
    const resetBody = `
      <h2 style="color: #d4af37; font-size: 20px; margin-top: 0;">Reset Your Password</h2>
      <p>Hello ${user.name},</p>
      <p>We received a request to reset your password for your account at Book World.</p>
      <p>Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background-color: #d4af37; color: #000000; font-weight: bold; text-decoration: none; border-radius: 8px; border: 1px solid #d4af37; transition: background-color 0.2s;">
          Reset Password
        </a>
      </div>
      <p>This secure reset link will expire in <strong>15 minutes</strong>.</p>
      <p>If you did not request a password reset, please secure your account immediately.</p>
    `;

    await sendBrandedEmail({
      to: user.email,
      subject: "Reset Your Password",
      bodyHtml: resetBody,
    });

    res.status(200).json({
      success: true,

      message:
        "Password reset link sent successfully",
    });

  } catch (error) {

    console.error("ForgotPassword Error:", error.message, error.code || "");

    res.status(500).json({
      success: false,

      message:
        "Failed to send reset email. Please try again later.",
    });
  }
};

// =========================================
// RESET PASSWORD
// =========================================

export const resetPassword = async (
  req,
  res
) => {
  try {

    const { token } =
      req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    // EMPTY FIELDS
    if (
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    // PASSWORD LENGTH
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // PASSWORD MATCH
    if (
      password !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // FIND USER
    const user =
      await User.findOne({
        resetPasswordToken:
          token,

        resetPasswordExpire: {
          $gt: Date.now(),
        },
      });

    // INVALID TOKEN
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token",
      });
    }

    // UPDATE PASSWORD
    user.password = password;

    // CLEAR TOKEN
    user.resetPasswordToken =
      "";

    user.resetPasswordExpire =
      null;

    await user.save();

    // If this is the admin, update the password in .env as well
    if (user.email.toLowerCase() === (process.env.ADMIN_EMAIL || "").toLowerCase()) {
      updateEnvValue("ADMIN_PASSWORD", password);
    }

    res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =========================================
// GET CURRENT USER
// =========================================

export const getCurrentUser = async (
  req,
  res
) => {
  try {

    res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};