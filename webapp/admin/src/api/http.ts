/*
 * ============================================================================
 * File        : http.ts
 * Description : Scaffold for making wrapper services in axios
 * ============================================================================
 * History
 * ============================================================================
 * Number | Date(YYYYMMDD) | Description
 * -------|----------------|----------------------------------------------------------------
 *      1 |   2025-09-02   | Initial version
 * 
 * ============================================================================
 */

import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
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