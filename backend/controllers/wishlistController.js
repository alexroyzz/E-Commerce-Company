import asyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
    "title price images ratings stock",
  );

  if (!wishlist) {
    return res.json({
      success: true,
      wishlist: { user: req.user._id, products: [] },
    });
  }

  res.json({ success: true, wishlist });
});

// @desc    Toggle a product in wishlist (add if absent, remove if present)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
    return res.status(201).json({ success: true, action: "added", wishlist });
  }

  const index = wishlist.products.findIndex((p) => p.toString() === productId);
  let action;

  if (index > -1) {
    // Already in wishlist — remove it
    wishlist.products.splice(index, 1);
    action = "removed";
  } else {
    // Not in wishlist — add it
    wishlist.products.push(productId);
    action = "added";
  }

  await wishlist.save();
  wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products",
    "title price images ratings stock",
  );

  res.json({ success: true, action, wishlist });
});

// @desc    Remove a specific product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== productId,
  );
  await wishlist.save();

  res.json({ success: true, message: "Removed from wishlist" });
});

export { getWishlist, toggleWishlist, removeFromWishlist };
