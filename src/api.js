
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://staging.asfur.mvp-apps.ae/api',
  headers: {
    Accept: 'application/json',
  }
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_logged_in");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;