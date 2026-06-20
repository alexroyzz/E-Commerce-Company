import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService.js";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import Pagination from "../components/ui/Pagination";
import useDebounce from "../hooks/useDebounce";
import { FaFilter, FaTimes } from "react-icons/fa";

const DEFAULT_FILTERS = {
  keyword: "",
  sort: "newest",
  category: "",
  "price[gte]": "",
  "price[lte]": "",
  page: 1,
};

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "",
  });

  const debouncedKeyword = useDebounce(filters.keyword, 500);

  // Fetch products when filters change (debounced on keyword)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { ...filters, keyword: debouncedKeyword };
        // Remove empty values
        Object.keys(params).forEach((k) => !params[k] && delete params[k]);
        const data = await productService.getProducts(params);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [
    debouncedKeyword,
    filters.sort,
    filters.category,
    filters["price[gte]"],
    filters["price[lte]"],
    filters.page,
  ]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {filters.keyword
              ? `Results for "${filters.keyword}"`
              : "All Products"}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">{total} products found</p>
          )}
        </div>
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 btn-secondary text-sm"
        >
          {showFilters ? (
            <>
              <FaTimes /> Close
            </>
          ) : (
            <>
              <FaFilter /> Filters
            </>
          )}
        </button>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={filters.keyword}
        onChange={(e) =>
          setFilters({ ...filters, keyword: e.target.value, page: 1 })
        }
        className="input-field mb-6 max-w-md"
      />

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div
          className={`lg:block lg:w-64 flex-shrink-0 ${showFilters ? "block w-full" : "hidden"}`}
        >
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} loading={loading} />
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
