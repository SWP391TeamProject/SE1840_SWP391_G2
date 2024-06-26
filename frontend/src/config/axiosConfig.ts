// axiosConfig.js
import { SERVER_DOMAIN_URL } from '@/constants/domain';
import axios from 'axios';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const instance = axios.create({
  // You can put your base URL here
  baseURL: SERVER_DOMAIN_URL,
});

instance.interceptors.response.use(

  function (response) {
    // If the response was successful, just return it
    return response;
  },
  function (error) {
    // If the response had a status of 401, redirect to /auth/login and remove the cookie
    if (error.response && error.response.status === 401) {
      // removeCookie('user');
      console.log('Redirect to login');
      window.location.href = '/auth/login';
      // redirect('/auth/login');
    }
    return Promise.reject(error);
  }
);

export default instance;