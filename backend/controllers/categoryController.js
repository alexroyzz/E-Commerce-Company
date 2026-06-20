import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../controllers/authController.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort("name");
  res.json({ success: true, count: categories.length, categories });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json({ success: true, category });
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const exists = await Category.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  let image = { url: "", public_id: "" };
  if (req.file) {
    image = await uploadToCloudinary(req.file.buffer, "shopsphere/categories");
  }

  const category = await Category.create({ name, image });
  res.status(201).json({ success: true, category });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name || category.name;

  if (req.file) {
    // Remove old image if it exists
    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }
    category.image = await uploadToCloudinary(req.file.buffer, "shopsphere/categories");
  }

  const updatedCategory = await category.save();
  res.json({ success: true, category: updatedCategory });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Prevent deletion if products are still assigned to this category
  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete category — ${productCount} product(s) are assigned to it`
    );
  }

  if (category.image?.public_id) {
    await cloudinary.uploader.destroy(category.image.public_id);
  }

  await category.deleteOne();
  res.json({ success: true, message: "Category deleted successfully" });
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};