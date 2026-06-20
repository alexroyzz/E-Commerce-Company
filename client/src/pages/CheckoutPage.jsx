import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import orderService from "../services/orderService";
import { PLACEHOLDER_IMAGE } from "../utils/constants";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", address: "", city: "", postalCode: "", country: "", phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        products: cart.items.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
        })),
        shippingAddress: form,
        paymentMethod,
      };

      const data = await orderService.createOrder(orderData);
      await clearCart();
      toast.success("Order placed successfully!");
      navigate(`/payment-success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const shipping = cartTotal >= 50 ? 0 : 5.99;

  return (
    <div className="container-custom py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "fullName", label: "Full Name", placeholder: "John Doe" },
                { name: "phone", label: "Phone", placeholder: "+1 555 123 4567" },
                { name: "address", label: "Address", placeholder: "123 Main St", full: true },
                { name: "city", label: "City", placeholder: "New York" },
                { name: "postalCode", label: "Postal Code", placeholder: "10001" },
                { name: "country", label: "Country", placeholder: "United States" },
              ].map(({ name, label, placeholder, full }) => (
                <div key={name} className={full ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="input-field"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-2">
              {["COD", "Card", "PayPal"].map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-primary-400 transition">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {method === "COD" ? "💵 Cash on Delivery" : method === "Card" ? "💳 Credit / Debit Card" : "🅿️ PayPal"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="card p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Your Order</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.items.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-center gap-3">
                  <img
                    src={product.images?.[0]?.url || PLACEHOLDER_IMAGE}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 font-medium line-clamp-2">{product.title}</p>
                    <p className="text-xs text-gray-500">Qty: {quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 flex-shrink-0">
                     ₹{(product.price * quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <hr className="border-gray-200 mb-3" />
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span> ₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-1">
                <span>Total</span>
                <span> ₹{(cartTotal + shipping).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;