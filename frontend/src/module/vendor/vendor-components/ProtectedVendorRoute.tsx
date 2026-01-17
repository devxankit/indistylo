
import { Navigate, Outlet } from "react-router-dom";
import { useVendorStore } from "../store/useVendorStore";
import { Loader2 } from "lucide-react";

export function ProtectedVendorRoute() {
    const { isAuthenticated, status, loading, token } = useVendorStore();



    // Not logged in -> Redirect to auth
    if (!isAuthenticated || !token) {
        return <Navigate to="/vendor/auth" replace />;
    }

    // Logged in but not active -> Redirect to verification pending
    if (status !== "active") {
        // Check if status is explicitly not active (pending, rejected, suspended)
        return <Navigate to="/vendor/verification-pending" replace />;
    }

    // Authorized and Active
    return <Outlet />;
}
