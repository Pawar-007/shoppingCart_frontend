import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function AdminRoute() {
  const { isAuthenticated, role, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "ADMIN") {
    // A CUSTOMER hitting an admin route is denied and sent home, not to
    // login (they're already authenticated — this is a permissions issue).
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
