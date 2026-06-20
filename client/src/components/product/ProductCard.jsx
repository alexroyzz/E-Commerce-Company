import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import RatingStars from "../ui/RatingStars";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // don't navigate to product page
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      return;
    }
    if (outOfStock) return;
    await addToCart(product._id, 1);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    await toggleWishlist(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="card hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-700 font-semibold text-sm px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist heart button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
            aria-label="Toggle wishlist"
          >
            {inWishlist ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-400 text-sm" />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          <span className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-1">
            {product.category?.name || "Uncategorized"}
          </span>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 flex-1 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <RatingStars
            rating={product.ratings}
            numReviews={product.numReviews}
          />

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart className="text-xs" />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
