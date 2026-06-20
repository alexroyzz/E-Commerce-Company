import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div className="text-8xl font-extrabold text-gray-200 mb-4">404</div>
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
    <p className="text-gray-500 mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary">
      Go Back Home
    </Link>
  </div>
);

export default NotFoundPage;
