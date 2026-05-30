import express from "express";
import { subscribeEmail, getConnectSubscribers } from "../controllers/connectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", subscribeEmail);
router.get("/", protect, adminProtect, getConnectSubscribers);

export default router;
