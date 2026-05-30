import express from "express";

import {
  getUsers,
  getSingleUser,
  blockUser,
  unblockUser,
  getUserInterestsExport,
  sendBulkEmail,
} from "../controllers/userController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  adminProtect,
  getUsers
);

router.get(
  "/export-interests",
  protect,
  adminProtect,
  getUserInterestsExport
);

router.post(
  "/send-bulk-email",
  protect,
  adminProtect,
  sendBulkEmail
);

router.get(
  "/:id",
  protect,
  adminProtect,
  getSingleUser
);

router.put(
  "/:id/block",
  protect,
  adminProtect,
  blockUser
);

router.put(
  "/:id/unblock",
  protect,
  adminProtect,
  unblockUser
);

export default router;