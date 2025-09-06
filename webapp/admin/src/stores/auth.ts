import { defineStore } from 'pinia';

export type Role = 'admin' | 'user' | 'guest';

interface User { id: number; username: string; role: Role }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null) as User | null,
  }),
  actions: {
    setAuth(token: string, user: User) {
      this.token = token; this.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.token = ''; this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});