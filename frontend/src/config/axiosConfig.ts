// axiosConfig.js
import { SERVER_DOMAIN_URL } from '@/constants/domain';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';
import { getCookie, removeCookie, setCookie } from '@/utils/cookies.ts';

const instance = axios.create({
  // You can put your base URL here
  baseURL: SERVER_DOMAIN_URL,
});

instance.interceptors.response.use(
  function (response) {
    // If the response was successful, just return it
    const token = response.headers['Authorization'] || response.headers.authorization;
    if (token && token !== getCookie('token')) {
      console.log('Token updated');
      // Ensure token is a string; if it can be null/undefined, handle appropriately
      setCookie('token', token, 30000);
    }
    return response;
  },
  function (error) {
    // If the response had a status of 401, redirect to /auth/login and remove the cookie
    if (error.response && error.response.status === 401) {
      removeCookie('user');
      console.log('Redirect to login');
      window.location.href = '/auth/login';
      // redirect('/auth/login');
    }
    return Promise.reject(error);
  }
);

export default instance;
