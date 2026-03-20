/*
 * ============================================================================
 * File        : http.ts
 * Description : Scaffold for making wrapper services in axios
 * ============================================================================
 * History
 * ============================================================================
 * Number | Date(YYYYMMDD) | Description
 * -------|----------------|----------------------------------------------------
 *      1 |   2025-09-02   | Initial version
 *      2 |   2026-03-20   | Add store for authentication
 * 
 * ============================================================================
 */

import axios from 'axios';
import { useAuthStore } from '../stores/authen/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const store = authStore.getToken();
  if (store != null && store.token) { // check token is existed?
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${store.token}`;
  }
  return config;
});

export default http;