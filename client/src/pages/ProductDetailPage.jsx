import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import productService from "../services/productService.js";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import RatingStars from "../components/ui/RatingStars";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import { PLACEHOLDER_IMAGE } from "../utils/constants";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data.product);
      } catch {
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Spinner />;
  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.info("Please login first"); return; }
    await addToCart(product._id, qty);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.info("Please login to review"); return; }
    setSubmittingReview(true);
    try {
      await productService.createReview(product._id, reviewForm);
      toast.success("Review submitted!");
      const data = await productService.getProductById(id);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const stockColor = product.stock > 10 ? "green" : product.stock > 0 ? "yellow" : "red";
  const stockLabel = product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock";

  return (
    <div className="container-custom py-10">
      <div className="grid md:grid-cols-2 gap-10 mb-14">
        {/* ── Images ── */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-square mb-3">
            <img
              src={product.images?.[selectedImg]?.url || PLACEHOLDER_IMAGE}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                    selectedImg === i ? "border-primary-500" : "border-gray-200"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          <span className="text-xs font-medium text-primary-600 uppercase tracking-widest">
            {product.category?.name}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-3">
            {product.title}
          </h1>
          <RatingStars rating={product.ratings} numReviews={product.numReviews} size="md" />

          <div className="text-3xl font-extrabold text-gray-900 my-4">
            ${product.price?.toFixed(2)}
          </div>

          <Badge label={stockLabel} color={stockColor} />

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          {/* Quantity + Actions */}
          {!outOfStock && (
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="px-4 py-2 font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:border-red-400 transition"
            >
              {inWishlist ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-gray-400 text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Review list */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Reviews ({product.numReviews})
          </h2>
          {product.reviews?.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {r.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{r.name}</p>
                      <RatingStars rating={r.rating} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        {isAuthenticated && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h2>
            <form onSubmit={handleReviewSubmit} className="card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="input-field"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{"★".repeat(n)} {n}/5</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Comment
                </label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="input-field resize-none"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary w-full"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;