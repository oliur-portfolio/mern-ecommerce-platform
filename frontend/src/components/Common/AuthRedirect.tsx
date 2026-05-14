import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

const AuthRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const from = location.state?.from?.pathname || "";

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to={from || "/admin-dashboard"} replace />;
  }

  if (isAuthenticated) {
    return <Navigate to={from || "/"} replace />;
  }

  return <Outlet />;
};

export default AuthRedirect;
