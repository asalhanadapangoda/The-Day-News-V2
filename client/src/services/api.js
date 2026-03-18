import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Because we use Vite proxy in dev, and relative in prod
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      const parsedInfo = JSON.parse(adminInfo);
      if (parsedInfo.token) {
        config.headers.Authorization = `Bearer ${parsedInfo.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
