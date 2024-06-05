import AuthContext from "@/AuthProvider";
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
  axios.interceptors.response.use(
    function (response) {
      // If the response was successful, just return it
      return response;
    },
    function (error) {
      // If the response had a status of 401, redirect to /auth/login and remove the cookie
      if (error.response && error.response.status === 401) {
        // removeCookie('user');
        redirect('/auth/login');
      }
      return Promise.reject(error);
    }
  );

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
