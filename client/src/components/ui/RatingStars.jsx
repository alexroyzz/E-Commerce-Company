import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// Renders filled, half, or empty stars based on a numeric rating
const RatingStars = ({ rating = 0, numReviews = 0, size = "sm" }) => {
  const starSize = size === "sm" ? "text-sm" : "text-lg";

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (rating >= i + 1) return <FaStar key={i} />;
    if (rating >= i + 0.5) return <FaStarHalfAlt key={i} />;
    return <FaRegStar key={i} />;
  });

  return (
    <div className="flex items-center gap-1">
      <div className={`flex text-amber-400 ${starSize}`}>{stars}</div>
      {numReviews > 0 && (
        <span className="text-gray-500 text-xs ml-1">({numReviews})</span>
      )}
    </div>
  );
};

export default RatingStars;