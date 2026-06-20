// Base URL for API requests
// In development, Vite proxy handles /api -> http://localhost:5000
// In production, set VITE_API_URL to your deployed backend URL
export const API_URL = import.meta.env.VITE_API_URL || "/api";

// LocalStorage keys
export const TOKEN_KEY = "shopsphere_token";
export const USER_KEY = "shopsphere_user";

// Sort options for product listing page
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// Order status options (for admin order management)
export const ORDER_STATUSES = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// Default placeholder image
export const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=No+Image";
