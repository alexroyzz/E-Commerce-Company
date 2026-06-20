import api from "./api";

// Place a new order (checkout)
const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

// Get logged-in user's order history
const getMyOrders = async () => {
  const { data } = await api.get("/orders/myorders");
  return data;
};

// Get a single order by ID
const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

// ----- Admin -----

const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

const updateOrderStatus = async (id, statusData) => {
  const { data } = await api.put(`/orders/${id}/status`, statusData);
  return data;
};

const getSalesStats = async () => {
  const { data } = await api.get("/orders/stats");
  return data;
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getSalesStats,
};