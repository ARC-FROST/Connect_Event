import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;