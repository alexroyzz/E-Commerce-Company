import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { toast } from "react-toastify";
import Spinner from "../../components/ui/Spinner";

const AdminProductForm = () => {
  const { id } = useParams(); // undefined for create, set for edit
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({ title: "", description: "", price: "", stock: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    categoryService.getCategories().then((d) => setCategories(d.categories || []));
    if (isEdit) {
      productService.getProductById(id).then(({ product }) => {
        setForm({
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category?._id || "",
        });
        setPreviews(product.images?.map((img) => img.url) || []);
        setInitialLoading(false);
      });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append("images", img));

      if (isEdit) {
        await productService.updateProduct(id, formData);
        toast.success("Product updated!");
      } else {
        await productService.createProduct(formData);
        toast.success("Product created!");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input-field"
            placeholder="Product title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field resize-none"
            rows={4}
            placeholder="Product description"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-field"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input-field"
              min="0"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary-400 transition">
            <FaUpload className="text-2xl text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload images (max 5)</span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-16 h-16">
                  <img src={src} className="w-full h-full object-cover rounded-lg" alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;