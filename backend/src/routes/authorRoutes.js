import express from "express";

import {
  getAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/authorController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getAuthors);

router.get("/:id", getSingleAuthor);

router.post(
  "/",
  protect,
  adminProtect,
  createAuthor
);

router.put(
  "/:id",
  protect,
  adminProtect,
  updateAuthor
);

router.delete(
  "/:id",
  protect,
  adminProtect,
  deleteAuthor
);

export default router;