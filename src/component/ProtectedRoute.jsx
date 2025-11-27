import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { authUser, profile, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile is complete (hanya username yang wajib, no_hp opsional)
  if (profile && !profile.username) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Check role
  if (requiredRole && profile?.role !== requiredRole) {
    // Redirect based on user's actual role
    if (profile?.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (profile?.role === "member") {
      return <Navigate to="/member" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

export const MemberRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="member">{children}</ProtectedRoute>;
};
