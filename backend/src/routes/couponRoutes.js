import express from "express";

import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getCoupons);

router.post("/validate", protect, validateCoupon);

router.post(
  "/",
  protect,
  adminProtect,
  createCoupon
);

router.delete(
  "/:id",
  protect,
  adminProtect,
  deleteCoupon
);

export default router;