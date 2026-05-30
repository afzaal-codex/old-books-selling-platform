import express from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/bookRequestController.js";
import { protect, optionalProtect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(optionalProtect, createRequest)
  .get(protect, adminOnly, getRequests);

router.route("/:id")
  .put(protect, adminOnly, updateRequestStatus);

export default router;
