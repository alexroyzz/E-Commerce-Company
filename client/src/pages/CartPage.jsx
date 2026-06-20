import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import { PLACEHOLDER_IMAGE } from "../utils/constants";

const CartPage = () => {
  const { cart, loading, cartTotal, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <Spinner />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container-custom py-10">
        <EmptyState
          icon={<FaShoppingBag />}
          title="Your cart is empty"
          description="Browse our products and add something you love."
          actionLabel="Shop Now"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart ({cart.items.length})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
          Clear Cart
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.items.map(({ product, quantity }) => (
            <div key={product._id} className="card flex items-center gap-4 p-4">
              <img
                src={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product._id}`} className="font-semibold text-gray-800 hover:text-primary-600 line-clamp-2 text-sm">
                  {product.title}
                </Link>
                <p className="text-primary-600 font-bold mt-1">${product.price?.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => quantity > 1 ? updateCartItem(product._id, quantity - 1) : removeFromCart(product._id)}
                  className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  <FaMinus className="text-xs" />
                </button>
                <span className="px-3 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => updateCartItem(product._id, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-40"
                >
                  <FaPlus className="text-xs" />
                </button>
              </div>

              <p className="font-bold text-gray-800 w-16 text-right text-sm">
                ${(product.price * quantity).toFixed(2)}
              </p>

              <button onClick={() => removeFromCart(product._id)} className="text-red-400 hover:text-red-600 ml-1">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">{cartTotal >= 50 ? "Free" : "$5.99"}</span>
              </div>
              <hr className="border-gray-200 my-2" />
              <div className="flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span>${(cartTotal >= 50 ? cartTotal : cartTotal + 5.99).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-sm text-primary-600 hover:underline mt-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;