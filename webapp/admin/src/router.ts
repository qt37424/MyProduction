import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Login from './views/Login.vue';
import AdminDashboard from './views/AdminDashboard.vue';
import Connections from './views/Connections.vue';
import Servers from './views/Servers.vue';
import Users from './views/Users.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/admin' },
    { path: '/admin', component: AdminDashboard, meta: { requiresAdmin: true } },
    { path: '/admin/connections', component: Connections, meta: { requiresAdmin: true } },
    { path: '/admin/servers', component: Servers, meta: { requiresAdmin: true } },
    { path: '/admin/users', component: Users, meta: { requiresAdmin: true } },
  ]
});

router.beforeEach((to) => {
  const store = useAuthStore();
  if (to.meta.requiresAdmin) {
    if (!store.token || store.user?.role !== 'admin') {
      return { path: '/login', query: { redirect: to.fullPath } };
    }
  }
});

export default router;