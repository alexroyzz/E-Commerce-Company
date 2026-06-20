import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Spinner from "../components/ui/Spinner";

// Redirects unauthenticated users to /login, preserving intended destination
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;