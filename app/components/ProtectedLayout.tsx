import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react"; // Optional: use an icon or spinner component

const ProtectedLayout = () => {
  const { loading, profile } = useAuth();
  const location = useLocation();

  // 1. Show loading indicator while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-blue-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // 2. Redirect unauthenticated users to login
  if (!profile) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Render protected content
  return (
    <div className="min-h-screen flex overflow-hidden ">
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
