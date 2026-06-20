import express from "express";
import {
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUT /api/users/profile — logged-in user updates their own profile
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);

// Admin-only routes for user management
router.route("/").get(protect, admin, getAllUsers); // GET /api/users

router
  .route("/:id")
  .get(protect, admin, getUserById) // GET /api/users/:id
  .put(protect, admin, updateUserByAdmin) // PUT /api/users/:id
  .delete(protect, admin, deleteUser); // DELETE /api/users/:id

export default router;
