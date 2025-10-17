import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom";
import usePermission from "../hooks/usePermission";
import AccessDenied from "../../screens/shared/AccessDenied";

const ProtectedRoute = ({ children , permission }: { children: React.ReactNode , permission: string }) => {
    const { user , isAuthenticated ,token } = useAuth();
    const { hasPermission } = usePermission();

    if (!isAuthenticated || !token || !user) {
        return <Navigate to="/login" />;
    }

    if (!hasPermission(permission)) {
        return <AccessDenied />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;