import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import productService from "../../services/productService";
import Spinner from "../../components/ui/Spinner";
import { toast } from "react-toastify";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Product
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Image", "Title", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <img src={p.images?.[0]?.url || PLACEHOLDER_IMAGE} alt="" className="w-12 h-12 object-cover rounded-lg" />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                  <p className="line-clamp-2">{p.title}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category?.name || "-"}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">${p.price?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-yellow-600" : "text-green-600"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-amber-500">⭐ {p.ratings?.toFixed(1) || "0.0"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/products/edit/${p._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                      <FaEdit />
                    </Link>
                    <button onClick={() => handleDelete(p._id, p.title)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center py-10 text-gray-500">No products yet. Add your first one!</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;