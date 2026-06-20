import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import orderService from "../services/orderService.js";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";

const statusColor = { processing: "blue", shipped: "yellow", delivered: "green", cancelled: "red" };

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(id).then((d) => setOrder(d.order)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return <p className="container-custom py-10 text-gray-500">Order not found.</p>;

  const addr = order.shippingAddress;

  return (
    <div className="container-custom py-10 max-w-3xl mx-auto">
      <Link to="/orders" className="text-primary-600 text-sm hover:underline mb-6 block">← Back to Orders</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Details</h1>
      <p className="text-xs text-gray-400 font-mono mb-6">{order._id}</p>

      {/* Status row */}
      <div className="card p-5 mb-5 flex flex-wrap gap-4">
        <div><p className="text-xs text-gray-500 mb-1">Order Status</p><Badge label={order.orderStatus} color={statusColor[order.orderStatus] || "gray"} /></div>
        <div><p className="text-xs text-gray-500 mb-1">Payment</p><Badge label={order.paymentStatus} color={order.paymentStatus === "paid" ? "green" : "yellow"} /></div>
        <div><p className="text-xs text-gray-500 mb-1">Method</p><span className="text-sm font-medium text-gray-700">{order.paymentMethod}</span></div>
        <div><p className="text-xs text-gray-500 mb-1">Date</p><span className="text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span></div>
      </div>

      {/* Products */}
      <div className="card p-5 mb-5">
        <h2 className="font-semibold text-gray-800 mb-3">Items Ordered</h2>
        <div className="space-y-3">
          {order.products.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              {item.image && <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-800"> ₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span> ₹{order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Shipping Address</h2>
        <p className="text-sm text-gray-700">{addr.fullName}</p>
        <p className="text-sm text-gray-600">{addr.address}, {addr.city}</p>
        <p className="text-sm text-gray-600">{addr.postalCode}, {addr.country}</p>
        <p className="text-sm text-gray-600">{addr.phone}</p>
      </div>
    </div>
  );
};

export default OrderDetailPage;