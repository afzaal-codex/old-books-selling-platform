import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/cmsController.js";
import {
  sendAdminOtp,
  verifyMatchClick,
  changeAdminPassword,
  changeAdminEmail,
  updateAdminProfile,
} from "../controllers/adminSecurityController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import { adminProtect } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadSingleImage } from "../services/uploadService.js";

const router = express.Router();

router.get("/verify-match", verifyMatchClick);

router.get("/", getSettings);

router.post(
  "/request-otp",
  protect,
  adminProtect,
  sendAdminOtp
);

router.put(
  "/admin-password",
  protect,
  adminProtect,
  changeAdminPassword
);

router.put(
  "/admin-email",
  protect,
  adminProtect,
  changeAdminEmail
);

router.put(
  "/admin-profile",
  protect,
  adminProtect,
  updateAdminProfile
);

router.put(
  "/",
  protect,
  adminProtect,
  updateSettings
);

router.post(
  "/upload",
  protect,
  adminProtect,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const result = await uploadSingleImage(req.file);
      res.status(200).json({ url: result.url });
    } catch (error) {
      res.status(500).json({ message: error.message || "Upload failed" });
    }
  }
);

export default router;
