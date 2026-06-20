import { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { toast } from "react-toastify";
import { ORDER_STATUSES } from "../../utils/constants";

const statusColor = { processing: "blue", shipped: "yellow", delivered: "green", cancelled: "red" };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAllOrders()
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      const data = await orderService.updateOrderStatus(orderId, { orderStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? data.order : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders ({orders.length})</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Update Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{order._id.slice(-8)}…</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{order.products?.length} item(s)</td>
                <td className="px-4 py-3 font-semibold text-gray-800">${order.totalAmount?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge label={order.paymentStatus} color={order.paymentStatus === "paid" ? "green" : "yellow"} />
                </td>
                <td className="px-4 py-3">
                  <Badge label={order.orderStatus} color={statusColor[order.orderStatus] || "gray"} />
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;