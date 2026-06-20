import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import cartService from "../services/cartService";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  // Fetch cart whenever auth status changes (login/logout)
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [] }); // clear cart on logout
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data.cart);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      throw error;
    }
  };

  // Update item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      const data = await cartService.updateCartItem(productId, quantity);
      setCart(data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const data = await cartService.removeFromCart(productId);
      setCart(data.cart);
      toast.info("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // Clear entire cart (after checkout)
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [] });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Derived values — calculated on every render from cart.items
  const cartCount =
    cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const cartTotal =
    cart.items?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    ) || 0;

  const value = {
    cart,
    loading,
    cartCount,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
