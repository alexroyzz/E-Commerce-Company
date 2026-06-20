import express from "express";
import { body } from "express-validator";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

const categoryValidation = [
  body("name").notEmpty().withMessage("Category name is required").trim(),
];

router
  .route("/")
  .get(getCategories) // Public
  .post(
    protect,
    admin,
    upload.single("image"),
    categoryValidation,
    validate,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, upload.single("image"), updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
