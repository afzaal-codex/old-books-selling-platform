import express from "express";

import {
  createPayment,
  getPayments,
  verifyPayment,
} from "../controllers/paymentController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createPayment
);

router.get(
  "/",
  protect,
  adminProtect,
  getPayments
);

router.put(
  "/:id",
  protect,
  adminProtect,
  verifyPayment
);

export default router;