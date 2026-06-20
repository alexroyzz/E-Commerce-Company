import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// @desc    Create a new order (checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  let totalAmount = 0;
  const orderItems = [];

  // Validate stock and build order item snapshots
  for (const item of products) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.title}"`);
    }

    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0]?.url || "",
      price: product.price,
      quantity: item.quantity,
    });

    totalAmount += product.price * item.quantity;

    // Decrease stock
    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    products: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
  });

  // Clear the user's cart after successful order placement
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's order history
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Get a single order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Ensure user can only view their own order, unless they're an admin
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort("-createdAt");
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Update order status (Admin) — e.g. processing -> shipped -> delivered
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  if (orderStatus === "delivered" && !order.deliveredAt) {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.json({ success: true, order: updatedOrder });
});

// @desc    Get sales statistics for admin dashboard
// @route   GET /api/orders/stats
// @access  Private/Admin
const getSalesStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();

  // Total revenue from paid orders only
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  // Orders grouped by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  // Monthly sales for the last 6 months (for charting)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlySales = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({
    success: true,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    monthlySales,
  });
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
};
