import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductStats,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Validation rules for creating/updating a product
const productValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category").notEmpty().withMessage("Category is required"),
];

const reviewValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").notEmpty().withMessage("Comment is required"),
];

// Public routes — order matters: specific paths before /:id
router.get("/featured", getFeaturedProducts);
router.get("/stats", protect, admin, getProductStats);
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes
router.post(
  "/:id/reviews",
  protect,
  reviewValidation,
  validate,
  createProductReview,
);

// Admin-only routes (with image upload — up to 5 images)
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  productValidation,
  validate,
  createProduct,
);

router
  .route("/:id")
  .put(protect, admin, upload.array("images", 5), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
