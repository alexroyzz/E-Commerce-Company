import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import ProductGrid from "../components/product/ProductGrid";

const features = [
  { icon: FaTruck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: FaShieldAlt, title: "Secure Payment", desc: "100% protected" },
  { icon: FaUndo, title: "Easy Returns", desc: "30-day policy" },
  { icon: FaHeadset, title: "24/7 Support", desc: "Always available" },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          productService.getFeaturedProducts(),
          categoryService.getCategories(),
        ]);
        setFeatured(prodData.products || []);
        setCategories(catData.categories?.slice(0, 6) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-primary-200 font-medium mb-3 tracking-wide uppercase text-sm">
              Welcome to Alyona
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Shop the Future,
              <br />
              <span className="text-amber-300">Today.</span>
            </h1>
            <p className="text-primary-100 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Discover thousands of products across every category — curated,
              priced fairly, and delivered fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/products"
                className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition inline-flex items-center gap-2"
              >
                Shop Now <FaArrowRight />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition"
              >
                Join Free
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden lg:flex justify-center">
            <div className="w-72 h-72 bg-white/10 rounded-full flex items-center justify-center text-8xl">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="container-custom py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-primary-600 hover:underline text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 hover:border-primary-300 hover:shadow-md transition"
              >
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-2xl">
                    🏷️
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 text-center group-hover:text-primary-600 transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section className="container-custom py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-primary-600 hover:underline text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} />
      </section>

      {/* ── CTA Banner ── */}
      <section className="container-custom py-8">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            New Arrivals Every Week 🎉
          </h2>
          <p className="text-orange-100 mb-6">
            Sign up for our newsletter and never miss a deal.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
