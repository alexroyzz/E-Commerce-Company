import { useEffect, useState } from "react";
import { FaBox, FaShoppingBag, FaUsers, FaDollarSign } from "react-icons/fa";
import productService from "../../services/productService.js";
import orderService from "../../services/orderService.js";
import userService from "../../services/userService.js";
import Spinner from "../../components/ui/Spinner.jsx";

// userService not built yet — we inline it here for simplicity
import api from "../../services/api";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-6 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
    >
      <Icon className="text-xl text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodStats, salesStats, usersData] = await Promise.all([
          productService.getProductStats(),
          orderService.getSalesStats(),
          api.get("/users").then((r) => r.data),
        ]);
        setStats({ prodStats, salesStats, usersCount: usersData.count });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const { prodStats, salesStats, usersCount } = stats;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={FaDollarSign}
          label="Total Revenue"
          value={`$${salesStats.totalRevenue?.toFixed(2) || "0.00"}`}
          color="bg-green-500"
        />
        <StatCard
          icon={FaShoppingBag}
          label="Total Orders"
          value={salesStats.totalOrders || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={FaBox}
          label="Total Products"
          value={prodStats.totalProducts || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={FaUsers}
          label="Total Users"
          value={usersCount || 0}
          color="bg-orange-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {salesStats.ordersByStatus?.map(({ _id, count }) => (
              <div key={_id} className="flex items-center justify-between">
                <span className="capitalize text-sm text-gray-600">{_id}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((count / salesStats.totalOrders) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-800 w-6 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Products */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Top Rated Products
          </h2>
          <div className="space-y-3">
            {prodStats.topRated?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4">
                  {i + 1}
                </span>
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt=""
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    ⭐ {p.ratings?.toFixed(1)} ({p.numReviews} reviews)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Products by Category
          </h2>
          <div className="space-y-3">
            {prodStats.categoryStats?.map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category}</span>
                <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            Monthly Sales (Last 6 Months)
          </h2>
          <div className="space-y-3">
            {salesStats.monthlySales?.map(({ _id, revenue, orders }) => {
              const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return (
                <div
                  key={`${_id.year}-${_id.month}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-600">
                    {monthNames[_id.month - 1]} {_id.year}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      ${revenue?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{orders} orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
