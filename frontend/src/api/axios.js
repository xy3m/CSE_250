import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Check if the error is 401
    if (error.response?.status === 401) {

      // *** THIS IS THE NEW LOGIC ***
      // Don't redirect if the 401 error came from the login or register page
      if (originalRequest.url === '/login' || originalRequest.url === '/register') {
        return Promise.reject(error); // Just let the component's catch() handle it
      }

      // For any other 401 error, log the user out.
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear the user object
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;