import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './pages/Dashboard.vue';
import Servers from './pages/Servers.vue';
import ServerDetail from './pages/ServerDetail.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/servers', component: Servers },
    { path: '/servers/:id', component: ServerDetail, props: true },
  ],
});