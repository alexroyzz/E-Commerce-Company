import ProductCard from "./ProductCard";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";
import { FaBoxOpen } from "react-icons/fa";

// Grid container for rendering product cards or loading/empty states
const ProductGrid = ({ products, loading }) => {
  if (loading) return <Spinner />;

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<FaBoxOpen />}
        title="No Products Found"
        description="Try adjusting your search or filters."
        actionLabel="Browse All Products"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;