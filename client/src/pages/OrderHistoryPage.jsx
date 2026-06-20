import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import orderService from "../services/orderService.js";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

const statusColor = { processing: "blue", shipped: "yellow", delivered: "green", cancelled: "red" };

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (orders.length === 0) {
    return (
      <div className="container-custom py-10">
        <EmptyState icon={<FaBoxOpen />} title="No orders yet" description="Place your first order today!" actionLabel="Shop Now" actionTo="/products" />
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 font-mono">{order._id}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={order.orderStatus} color={statusColor[order.orderStatus] || "gray"} />
                <Badge label={order.paymentStatus} color={order.paymentStatus === "paid" ? "green" : "yellow"} />
              </div>
            </div>

            {/* Product thumbnails */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto">
              {order.products.slice(0, 4).map((item, i) => (
                <img key={i} src={item.image || ""} alt={item.title}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ))}
              {order.products.length > 4 && (
                <span className="text-xs text-gray-500">+{order.products.length - 4} more</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800">${order.totalAmount?.toFixed(2)}</span>
              <Link to={`/orders/${order._id}`} className="text-sm text-primary-600 hover:underline font-medium">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;