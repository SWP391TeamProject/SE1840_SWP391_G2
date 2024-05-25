import AuthContext from "@/AuthProvider";
import { Roles } from "@/constants/enums";
import { getCookie } from "@/utils/cookies";
import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

type RolesEnum = {
  allowedRoles: Roles[];
};

const PrivateRoute = ({ allowedRoles }: RolesEnum) => {
  const location = useLocation();
  const userCookie = getCookie("user");
  let parsedUser = null;

  if (userCookie) {
    try {
      parsedUser = JSON.parse(userCookie);
    } catch (error) {
      console.error("Error parsing user cookie", error);
    }
  }
  return allowedRoles?.includes(parsedUser?.role) ? (
    <Outlet />
  ) : parsedUser?.email ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
