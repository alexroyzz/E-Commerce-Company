import api from "./api";

const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

const addToCart = async (productId, quantity = 1) => {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
};

const updateCartItem = async (productId, quantity) => {
  const { data } = await api.put(`/cart/${productId}`, { quantity });
  return data;
};

const removeFromCart = async (productId) => {
  const { data } = await api.delete(`/cart/${productId}`);
  return data;
};

const clearCart = async () => {
  const { data } = await api.delete("/cart");
  return data;
};

export default { getCart, addToCart, updateCartItem, removeFromCart, clearCart };