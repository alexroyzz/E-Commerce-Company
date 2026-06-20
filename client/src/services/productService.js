import api from "./api";

// Get products with optional query params (search, filter, sort, pagination)
// queryParams example: { keyword: 'shoe', category: '...', sort: 'price_asc', page: 1 }
const getProducts = async (queryParams = {}) => {
  const { data } = await api.get("/products", { params: queryParams });
  return data;
};

// Get featured products for homepage
const getFeaturedProducts = async () => {
  const { data } = await api.get("/products/featured");
  return data;
};

// Get a single product by ID
const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// Submit a product review
const createReview = async (productId, reviewData) => {
  const { data } = await api.post(`/products/${productId}/reviews`, reviewData);
  return data;
};

// ----- Admin -----

const createProduct = async (formData) => {
  const { data } = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

const getProductStats = async () => {
  const { data } = await api.get("/products/stats");
  return data;
};

export default {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createReview,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};