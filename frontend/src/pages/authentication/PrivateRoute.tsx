import AuthContext, { useAuth } from "@/AuthProvider";
import { Roles } from "@/constants/enums";
import { getCookie, removeCookie } from "@/utils/cookies";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet, useNavigate, redirect } from "react-router-dom";
import { toast } from "react-toastify";

type RolesEnum = {
  allowedRoles: Roles[];
};

const PrivateRoute = ({ allowedRoles }: RolesEnum) => {
  const location = useLocation();
  const userCookie = getCookie("user");
  const nav = useNavigate();
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
