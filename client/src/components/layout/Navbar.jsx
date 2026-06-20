import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes,
  FaSearch, FaSignOutAlt, FaTachometerAlt, FaStore,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const wishlistCount = wishlist?.products?.length || 0;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-extrabold text-xl">
            <FaStore />
            <span>Alyona</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition">
              Shop
            </Link>

            {isAuthenticated ? (
              <>
                {/* Wishlist */}
                <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500 transition">
                  <FaHeart className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition">
                  <FaShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                    {user?.profilePicture?.url ? (
                      <img
                        src={user.profilePicture.url}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-primary-200"
                      />
                    ) : (
                      <FaUser className="text-xl" />
                    )}
                    <span>{user?.name?.split(" ")[0]}</span>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaUser className="text-xs" /> Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FaShoppingCart className="text-xs" /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 font-medium hover:bg-gray-50">
                        <FaTachometerAlt className="text-xs" /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <FaSignOutAlt className="text-xs" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            {isAuthenticated && (
              <Link to="/cart" className="relative text-gray-600">
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600 text-xl">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaSearch />
              </button>
            </form>

            <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-1">Shop</Link>

            {isAuthenticated ? (
              <>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                  <FaHeart /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                  <FaUser /> Profile
                </Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                  <FaShoppingCart /> My Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-primary-600 font-medium py-1">
                    <FaTachometerAlt /> Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 py-1">
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-sm py-2 flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-2 flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;