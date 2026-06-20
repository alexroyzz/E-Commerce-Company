import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Pagination bar for the product listing page
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FaChevronLeft className="text-sm" />
      </button>

      {/* Page number buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg border text-sm font-medium transition ${
            page === currentPage
              ? "bg-primary-600 text-white border-primary-600"
              : "border-gray-300 hover:bg-gray-100 text-gray-700"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;