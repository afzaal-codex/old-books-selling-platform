import express from "express";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getAdminDashboardStats,
  incrementDownloadCount,
  getSixMonthReport,
} from "../controllers/orderController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", optionalProtect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/admin/report-csv", protect, adminProtect, getSixMonthReport);
router.get("/admin/stats", protect, adminProtect, getAdminDashboardStats);
router.get("/", protect, adminProtect, getAllOrders);
router.get("/:id", optionalProtect, getSingleOrder);
router.put("/:id/status", protect, adminProtect, updateOrderStatus);
router.put("/:id/increment-download", protect, adminProtect, incrementDownloadCount);
router.put("/:id/cancel", protect, cancelOrder);

export default router;