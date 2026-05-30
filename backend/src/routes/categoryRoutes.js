import express from "express";

import {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  protect,
  optionalProtect,
} from "../middleware/authMiddleware.js";

import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getCategories);

router.get("/:id", optionalProtect, getSingleCategory);

router.post(
  "/",
  protect,
  adminProtect,
  createCategory
);

router.put(
  "/:id",
  protect,
  adminProtect,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  adminProtect,
  deleteCategory
);

export default router;