import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
  FaTachometerAlt, FaBox, FaTags, FaShoppingBag,
  FaUsers, FaStore, FaBars, FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/admin/products", label: "Products", icon: FaBox },
  { to: "/admin/categories", label: "Categories", icon: FaTags },
  { to: "/admin/orders", label: "Orders", icon: FaShoppingBag },
  { to: "/admin/users", label: "Users", icon: FaUsers },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Admin Brand */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <FaStore className="text-primary-400 text-xl" />
        <div>
          <p className="text-white font-bold text-sm">ShopSphere</p>
          <p className="text-gray-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon className="text-base" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div className="p-4 border-t border-gray-700">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          ← Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gray-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-gray-900 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 text-xl"
          >
            <FaBars />
          </button>
          <h1 className="font-semibold text-gray-700 text-lg">Admin Dashboard</h1>
          <Link to="/" className="text-sm text-primary-600 hover:underline hidden sm:block">
            View Store →
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default AdminLayout;