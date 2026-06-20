import api from "./api";

const getWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return data;
};

const toggleWishlist = async (productId) => {
  const { data } = await api.post(`/wishlist/${productId}`);
  return data;
};

const removeFromWishlist = async (productId) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data;
};

export default { getWishlist, toggleWishlist, removeFromWishlist };
localStorage;
