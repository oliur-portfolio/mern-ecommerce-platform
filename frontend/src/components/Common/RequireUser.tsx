import toast from "react-hot-toast";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const RequireUser = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role === "admin") {
    toast.error("You do not have permission to access this customer page");
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
};

export default RequireUser;
