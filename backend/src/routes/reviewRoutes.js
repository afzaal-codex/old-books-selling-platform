import express from "express";
import {
  createReview,
  getBookReviews,
  deleteReview,
  replyToReview,
  likeReview,
  adminUpdateReviewStatus,
  adminGetReviews,
  adminDeleteReview,
  uploadReviewMediaFiles,
} from "../controllers/reviewController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";
import { uploadReviewMedia } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/book/:bookId", getBookReviews);
router.post("/upload", optionalProtect, uploadReviewMedia.array("media", 5), uploadReviewMediaFiles);
router.post("/", protect, createReview);
router.delete("/:id", protect, deleteReview);
router.post("/:id/replies", protect, replyToReview);
router.post("/:id/like", protect, likeReview);

// Admin Routes
router.get("/admin", protect, adminProtect, adminGetReviews);
router.put("/:id/status", protect, adminProtect, adminUpdateReviewStatus);
router.delete("/admin/:id", protect, adminProtect, adminDeleteReview);

export default router;