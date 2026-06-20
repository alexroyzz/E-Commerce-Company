import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import categoryService from "../../services/categoryService";
import Spinner from "../../components/ui/Spinner";
import { toast } from "react-toastify";
import { PLACEHOLDER_IMAGE } from "../../utils/constants";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openModal = (cat = null) => {
    setEditCat(cat);
    setForm({ name: cat?.name || "" });
    setImage(null);
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (image) fd.append("image", image);

      if (editCat) {
        await categoryService.updateCategory(editCat._id, fd);
        toast.success("Category updated");
      } else {
        await categoryService.createCategory(fd);
        toast.success("Category created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="card p-4 flex items-center gap-4">
            <img
              src={cat.image?.url || PLACEHOLDER_IMAGE}
              alt={cat.name}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.slug}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => openModal(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">{editCat ? "Edit" : "Add"} Category</h2>
              <button onClick={() => setModal(false)}><FaTimes className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-gray-600" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;