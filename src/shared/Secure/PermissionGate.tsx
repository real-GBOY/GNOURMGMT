import usePermission from "../hooks/usePermission";

interface PermissionGateProps {
    children: React.ReactNode;
    permission: string;
}

export default function PermissionGate({ 
    children, 
    permission
}: PermissionGateProps) {
    const { hasPermission } = usePermission();


    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}