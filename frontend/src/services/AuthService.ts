import axios from "@/config/axiosConfig.ts";
import { AuthResponse } from "@/models/AuthResponse";
import { Login } from "@/models/Login";
import { Register } from "@/models/Register";
import { getCookie } from "@/utils/cookies";
import { AUTH_SERVER } from "@/constants/domain";

const baseUrl = AUTH_SERVER;

const authHeader = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
};

// Service methods

export const login = async (loginDTO: Login): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/login`, loginDTO, authHeader);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${baseUrl}/logout`, {
    token: JSON.parse(getCookie("user")).accessToken,
  }, authHeader);
};

export const loginWithGoogle = async (token: string | null): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>(`${baseUrl}/login-with-google`, {
    ...authHeader,
    params: { token },
  });
  return response.data;
};

export const loginWithFacebook = async (token: string): Promise<AuthResponse> => {
  const response = await axios.get<AuthResponse>(`${baseUrl}/login-with-facebook`, {
    ...authHeader,
    params: { token },
  });
  return response.data;
};

export const register = async (registerDTO: Register): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/register`, registerDTO, authHeader);
  return response.data;
};

export const requestResetPassword = async (dto: { email: string }): Promise<void> => {
  await axios.post(`${baseUrl}/request-reset-password/`, dto, {
    ...authHeader
  });
};

export const resetPassword = async (dto: { code: string, password: string }): Promise<void> => {
  await axios.post(`${baseUrl}/reset-password/`, dto, {
    ...authHeader
  });
};

export const requestActivateAccount = async (dto: { email: string }): Promise<void> => {
  await axios.post(`${baseUrl}/request-activate-account/`, dto, {
    ...authHeader
  });
};


export const requestChangePassword = async (data, id): Promise<void> => {
  await axios.post(`${baseUrl}/change-password/${id}`, data, {
    ...authHeader
  });
};


export const activateAccount = async (code: string): Promise<void> => {
  await axios.post(`${baseUrl}/activate-account/`, null, {
    ...authHeader,
    params: { code },
  });
};
