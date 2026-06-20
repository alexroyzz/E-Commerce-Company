import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// POST /api/auth/register — supports optional 'profilePicture' file upload
router.post(
  "/register",
  upload.single("profilePicture"),
  registerValidation,
  validate,
  registerUser,
);

// POST /api/auth/login
router.post("/login", loginValidation, validate, loginUser);

// GET /api/auth/profile — get currently logged-in user
router.get("/profile", protect, getProfile);

export default router;
