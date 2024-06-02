const dev = process.env.NODE_ENV === 'development';
export const API_SERVER: string = dev ? "https://localhost:8080/api/" : "/api/";
export const AUTH_SERVER: string = dev ? "https://localhost:8080/auth/" : "/auth/";