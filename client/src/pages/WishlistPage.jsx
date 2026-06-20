import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { Link } from "react-router-dom";
import { PLACEHOLDER_IMAGE } from "../utils/constants";
import RatingStars from "../components/ui/RatingStars";

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <Spinner />;

  if (!wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="container-custom py-10">
        <EmptyState
          icon={<FaHeart />}
          title="Your wishlist is empty"
          description="Save products you love to your wishlist."
          actionLabel="Browse Products"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My Wishlist ({wishlist.products.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.products.map((product) => (
          <div key={product._id} className="card flex flex-col">
            <Link to={`/products/${product._id}`} className="block overflow-hidden">
              <img
                src={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                alt={product.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-4 flex flex-col flex-1">
              <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 mb-1 text-sm">
                {product.title}
              </Link>
              <RatingStars rating={product.ratings} />
              <div className="flex items-center justify-between mt-auto pt-3">
                <span className="font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                    className="text-xs btn-primary py-1.5 px-3 disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;