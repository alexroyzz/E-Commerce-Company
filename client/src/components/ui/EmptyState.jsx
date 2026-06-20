import { Link } from "react-router-dom";

// Generic empty-state display used for empty cart, wishlist, orders, etc.
const EmptyState = ({ icon, title, description, actionLabel, actionTo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl text-gray-300 mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;