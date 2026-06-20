import express from "express";
import { body } from "express-validator";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

const orderValidation = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one product"),
  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required"),
  body("shippingAddress.address").notEmpty().withMessage("Address is required"),
  body("shippingAddress.city").notEmpty().withMessage("City is required"),
  body("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required"),
  body("shippingAddress.country").notEmpty().withMessage("Country is required"),
  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required"),
];

// All order routes require authentication
router.use(protect);

// User routes
router.post("/", orderValidation, validate, createOrder);
router.get("/myorders", getMyOrders);

// Admin routes — placed before /:id to avoid route collision
router.get("/stats", admin, getSalesStats);
router.get("/", admin, getAllOrders);
router.put("/:id/status", admin, updateOrderStatus);

// Shared (owner or admin — checked inside controller)
router.get("/:id", getOrderById);

export default router;
