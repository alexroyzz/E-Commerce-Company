import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../controllers/authController.js";

// @desc    Update logged-in user's profile (name, email, password, picture)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  // Only update password if a new one is provided
  if (req.body.password) {
    user.password = req.body.password; // pre-save hook will hash it
  }

  // Handle new profile picture upload
  if (req.file) {
    // Delete old image from Cloudinary if it exists
    if (user.profilePicture?.public_id) {
      await cloudinary.uploader.destroy(user.profilePicture.public_id);
    }
    user.profilePicture = await uploadToCloudinary(
      req.file.buffer,
      "shopsphere/users",
    );
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    profilePicture: updatedUser.profilePicture,
  });
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json({ success: true, count: users.length, users });
});

// @desc    Get single user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ success: true, user });
});

// @desc    Update user role / details (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();
  res.json({ success: true, user: updatedUser });
});

// @desc    Delete a user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  // Clean up profile picture from Cloudinary
  if (user.profilePicture?.public_id) {
    await cloudinary.uploader.destroy(user.profilePicture.public_id);
  }

  await user.deleteOne();
  res.json({ success: true, message: "User removed successfully" });
});

export {
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
};
