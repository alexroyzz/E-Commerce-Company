import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import orderService from "../services/orderService.js";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";

const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrderById(orderId)
      .then((d) => setOrder(d.order))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Spinner />;

  return (
    <div className="container-custom py-16 max-w-xl mx-auto text-center">
      <div className="card p-10">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {order && (
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-xs text-gray-700">
                {order._id}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              <span className="font-bold">
                ₹{order.totalAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Status</span>
              <Badge label={order.orderStatus} color="blue" />
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Payment</span>
              <Badge
                label={order.paymentStatus}
                color={order.paymentStatus === "paid" ? "green" : "yellow"}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
