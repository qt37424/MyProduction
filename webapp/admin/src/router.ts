/*
=======================================================================================
* File : router.ts
* Description : Control router in application
=======================================================================================
* History *
=======================================================================================
* Number | Date(YYYYMMDD) | Description
---------|----------------|------------------------------------------------------------
*      1 |   2025-09-02   | Initial version
=======================================================================================
*/

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/authen/auth'
import Login from './views/Login.vue';
import AdminDashboard from './views/AdminDashboard.vue';
import Connections from './views/Connections.vue';
import Servers from './views/Servers.vue';
import Users from './views/Users.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/admin' }, // chưa có page load cho home
    { path: '/admin', component: AdminDashboard, meta: { requiresAdmin: true } },
    { path: '/admin/connections', component: Connections, meta: { requiresAdmin: true } },
    { path: '/admin/servers', component: Servers, meta: { requiresAdmin: true } },
    { path: '/admin/users', component: Users, meta: { requiresAdmin: true } },
  ]
});

router.beforeEach((to) => {
  const store = useAuthStore().getToken();
  if (to.meta.requiresAdmin) {
    if (store == null) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }
  }
});

export default router;