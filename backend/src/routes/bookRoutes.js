import express from "express";

import {
  getBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
  getAdminBooksAnalytics,
  getFeaturedBooks,
  getBestSellerBooks,
  getHighDiscountBooks,
} from "../controllers/bookController.js";

import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ── Public routes (specific pehle, /:id last mein) ──
router.get("/", optionalProtect, getBooks);
router.get("/featured", optionalProtect, getFeaturedBooks);
router.get("/bestsellers", optionalProtect, getBestSellerBooks);
router.get("/high-discounts", optionalProtect, getHighDiscountBooks);

// ── Admin routes ──
router.get("/admin/analytics", protect, adminProtect, getAdminBooksAnalytics);
router.post("/", protect, adminProtect, upload.fields([
  { name: "images", maxCount: 10 },
  { name: "newReleaseBgImage", maxCount: 1 }
]), createBook);

// ── /:id hamesha last ──
router.get("/:id", optionalProtect, getSingleBook);
router.put("/:id", protect, adminProtect, upload.fields([
  { name: "images", maxCount: 10 },
  { name: "newReleaseBgImage", maxCount: 1 }
]), updateBook);
router.delete("/:id", protect, adminProtect, deleteBook);

export default router;