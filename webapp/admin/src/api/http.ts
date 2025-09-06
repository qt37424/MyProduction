import axios from 'axios';
import { useAuthStore } from '../stores/auth';

// const http = axios.create();

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const store = useAuthStore();
  if (store.token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${store.token}`;
  }
  return config;
});

export default http;