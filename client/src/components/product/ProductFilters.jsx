import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import { SORT_OPTIONS } from "../../utils/constants";

// Sidebar filter panel for the product listing page
const ProductFilters = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getCategories().then((d) => setCategories(d.categories || []));
  }, []);

  const handleChange = (key, value) => onFilterChange({ ...filters, [key]: value, page: 1 });

  return (
    <aside className="card p-5 space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Sort By</h3>
        <select
          value={filters.sort || "newest"}
          onChange={(e) => handleChange("sort", e.target.value)}
          className="input-field text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleChange("category", "")}
              className="accent-primary-600"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat._id}
                onChange={() => handleChange("category", cat._id)}
                className="accent-primary-600"
              />
              <span className="text-sm text-gray-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters["price[gte]"] || ""}
            onChange={(e) => handleChange("price[gte]", e.target.value)}
            className="input-field text-sm"
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters["price[lte]"] || ""}
            onChange={(e) => handleChange("price[lte]", e.target.value)}
            className="input-field text-sm"
            min="0"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button onClick={onReset} className="w-full btn-secondary text-sm">
        Reset Filters
      </button>
    </aside>
  );
};

export default ProductFilters;