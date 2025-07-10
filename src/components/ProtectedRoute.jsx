import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    if (location.pathname === "/dashboard") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/auth" replace />;
  }
  return children;
}
