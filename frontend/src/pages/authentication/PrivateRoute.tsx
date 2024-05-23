import AuthContext from "@/AuthProvider";
import { Roles } from "@/constants/enums";
import { getCookie } from "@/utils/cookies";
import { get } from "http";
import { useContext, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

type RolesEnum = {
  allowedRoles: Roles[];
};

const PrivateRoute = ({ allowedRoles }: RolesEnum) => {
  const location = useLocation();
  return allowedRoles?.includes(JSON.parse(getCookie("user"))?.role) ? (
    <Outlet />
  ) : JSON.parse(getCookie("user"))?.email ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
