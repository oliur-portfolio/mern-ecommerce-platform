import toast from "react-hot-toast";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const RequireAdmin = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    toast.error("You do not have permission to access this page");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
