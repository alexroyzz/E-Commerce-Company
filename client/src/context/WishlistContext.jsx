import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import wishlistService from "../services/wishlistService";
import { useAuth } from "./authContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ products: [] });
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle product in wishlist (add/remove)
  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.info("Please login to use wishlist");
      return;
    }
    try {
      const data = await wishlistService.toggleWishlist(productId);
      setWishlist(data.wishlist);
      toast.success(
        data.action === "added"
          ? "Added to wishlist!"
          : "Removed from wishlist",
      );
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p._id !== productId),
      }));
      toast.info("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  // Helper — check if a product is in the wishlist (for heart icon state)
  const isInWishlist = (productId) => {
    return wishlist.products?.some((p) => p._id === productId);
  };

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
