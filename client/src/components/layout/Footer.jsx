import { Link } from "react-router-dom";
import { FaStore, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-3">
              <FaStore />
              <span>ShopSphere</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your modern destination for quality products, great prices, and a
              seamless shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["Home", "/"],
                ["Shop", "/products"],
                ["Cart", "/cart"],
                ["My Orders", "/orders"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {["Electronics", "Clothing", "Home & Garden", "Sports"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      to="/products"
                      className="hover:text-white transition"
                    >
                      {cat}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-sm mb-1">support@alyona.com</p>
            <p className="text-sm mb-4">+1 (555) 123-4567</p>
            <div className="flex gap-3">
              {[FaGithub, FaTwitter, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="hover:text-white transition text-lg"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Alyona. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
