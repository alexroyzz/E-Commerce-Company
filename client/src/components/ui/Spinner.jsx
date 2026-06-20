// Reusable loading spinner with size variants
const Spinner = ({ size = "md", center = true }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className={center ? "flex items-center justify-center py-10" : ""}>
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;