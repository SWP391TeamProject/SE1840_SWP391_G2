import AuthContext from "@/AuthProvider";
import { Roles } from "@/constants/enums";
import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

type RolesEnum = {
    allowedRoles: Roles[]
}

const PrivateRoute = ({ allowedRoles }: RolesEnum) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    return allowedRoles?.includes(user?.role) ? (
        <Outlet />
    ) : user?.email ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Navigate to="/auth/login" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
