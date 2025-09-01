import { defineStore } from 'pinia';
import api from '../api/client';

export type ServerItem = {
  id: string; name: string; host: string; port: number; username: string; authType: 'password'|'key'; tags?: string[];
};

export const useServers = defineStore('servers', {
  state: ()=>({ list: [] as ServerItem[], loading:false }),
  actions: {
    async fetch(){ this.loading = true; const { data } = await api.get('/servers'); this.list = data; this.loading=false; },
    async create(payload: Omit<ServerItem,'id'> & { password?: string }){ const { data } = await api.post('/servers', payload); this.list.push(data); return data; },
    async ping(id:string){ const { data } = await api.post(`/servers/${id}/ping`); return data; },
  }
});