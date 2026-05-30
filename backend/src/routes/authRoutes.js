import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  sendSignupOTP,
verifySignupOTP,
} from "../controllers/authController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";
import transporter from "../config/email.js";

const router = express.Router();


// =========================================
// AUTH ROUTES
// =========================================

// REGISTER
router.post("/signup", registerUser);

// LOGIN
router.post("/login", loginUser);

// CURRENT USER
router.get("/me", protect, getCurrentUser);

router.post(
  "/google",
  googleLogin
);
router.post(
  "/forgot-password",
  forgotPassword
);

router.put(
  "/reset-password/:token",
  resetPassword
);

router.post(
  "/send-signup-otp",
  sendSignupOTP
);

router.post(
  "/verify-signup-otp",
  verifySignupOTP
);



export default router;