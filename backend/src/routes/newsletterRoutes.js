import express from "express";
import { subscribeNewsletter, getNewsletterSubscribers, sendCustomEmail } from "../controllers/newsletterController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", subscribeNewsletter);
router.get("/", protect, adminProtect, getNewsletterSubscribers);
router.post("/send-custom-email", protect, adminProtect, sendCustomEmail);

export default router;
