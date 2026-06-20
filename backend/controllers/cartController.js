import asyncHandler from "express-async-handler";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title price images stock"
  );

  // If user has no cart yet, return an empty one (don't create until needed)
  if (!cart) {
    return res.json({ success: true, cart: { user: req.user._id, items: [] } });
  }

  res.json({ success: true, cart });
});

// @desc    Add item to cart (or increase quantity if it exists)
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Insufficient stock available");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create a new cart for the user
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Item exists — update quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // New item — push to array
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title price images stock"
  );

  res.status(200).json({ success: true, cart });
});

// @desc    Update quantity of a specific cart item
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  item.quantity = quantity;
  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title price images stock"
  );

  res.json({ success: true, cart: updatedCart });
});

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title price images stock"
  );

  res.json({ success: true, cart: updatedCart });
});

// @desc    Clear entire cart (e.g. after successful order)
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: "Cart cleared successfully" });
});

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };