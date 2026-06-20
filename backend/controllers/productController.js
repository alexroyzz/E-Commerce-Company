import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import APIFeatures from "../utils/apiFeatures.js";
import { uploadToCloudinary } from "../controllers/authController.js";

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // Total count for pagination metadata (before pagination is applied)
  const filterFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();
  const total = await Product.countDocuments(filterFeatures.query.getFilter());

  // Apply search, filter, sort, and pagination
  const features = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .paginate();

  const products = await features.query.populate("category", "name slug");

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;

  res.json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    products,
  });
});

// @desc    Get featured products (top-rated, limited count) for Home page
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort("-ratings -createdAt")
    .limit(8)
    .populate("category", "name slug");

  res.json({ success: true, products });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .populate("reviews.user", "name profilePicture");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock, category } = req.body;

  if (!title || !description || !price || !category) {
    res.status(400);
    throw new Error("Please provide all required product fields");
  }

  // Upload all images to Cloudinary (req.files comes from multer .array())
  let images = [];
  if (req.files && req.files.length > 0) {
    images = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, "shopsphere/products"))
    );
  } else {
    res.status(400);
    throw new Error("Please upload at least one product image");
  }

  const product = await Product.create({
    title,
    description,
    price,
    stock,
    category,
    images,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { title, description, price, stock, category } = req.body;

  product.title = title || product.title;
  product.description = description || product.description;
  product.price = price ?? product.price;
  product.stock = stock ?? product.stock;
  product.category = category || product.category;

  // If new images are uploaded, replace old ones (delete old from Cloudinary)
  if (req.files && req.files.length > 0) {
    // Delete existing images from Cloudinary
    await Promise.all(
      product.images.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    // Upload new images
    product.images = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer, "shopsphere/products"))
    );
  }

  const updatedProduct = await product.save();
  res.json({ success: true, product: updatedProduct });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Clean up all associated images from Cloudinary
  await Promise.all(
    product.images.map((img) => cloudinary.uploader.destroy(img.public_id))
  );

  await product.deleteOne();
  res.json({ success: true, message: "Product deleted successfully" });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Prevent duplicate reviews from the same user
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // Recalculate average rating
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: "Review added successfully" });
});

// @desc    Get product statistics for admin dashboard
// @route   GET /api/products/stats
// @access  Private/Admin
const getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const outOfStock = await Product.countDocuments({ stock: 0 });

  // Top 5 products by rating
  const topRated = await Product.find({})
    .sort("-ratings")
    .limit(5)
    .select("title ratings numReviews images");

  // Count of products per category
  const categoryStats = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $project: {
        _id: 0,
        category: "$category.name",
        count: 1,
      },
    },
  ]);

  res.json({
    success: true,
    totalProducts,
    outOfStock,
    topRated,
    categoryStats,
  });
});

export {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductStats,
};