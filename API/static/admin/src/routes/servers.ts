import { Router } from 'express';
import { createServer, deleteServer, getServer, listServers, updateServer } from '../services/inventory.js';
import { log } from '../services/audit.js';
import { pingServer, execCommand } from '../services/ssh.js';

export const serversRouter = Router();

serversRouter.get('/', (req,res)=>{ res.json(listServers()); });

serversRouter.post('/', async (req,res)=>{
  const s = await createServer(req.body);
  log({ ts: Date.now(), level:'info', message:'server.create', meta: { id: s.id, name: s.name } });
  res.status(201).json(s);
});

serversRouter.get('/:id', (req,res)=>{
  const s = getServer(req.params.id);
  if (!s) return res.status(404).json({ error:'not found' });
  res.json(s);
});

serversRouter.put('/:id', (req,res)=>{
  try{ const s = updateServer(req.params.id, req.body); res.json(s); }
  catch{ res.status(404).json({ error:'not found' }); }
});

serversRouter.delete('/:id', (req,res)=>{ deleteServer(req.params.id); res.status(204).end(); });

serversRouter.post('/:id/ping', async (req,res)=>{
  const s = await getServer(req.params.id);
  if (!s) return res.status(404).json({ error:'not found' });
  const r = await pingServer(s);
  res.json(r);
});

serversRouter.post('/:id/exec', async (req,res)=>{
  const s = await getServer(req.params.id);
  if (!s) return res.status(404).json({ error:'not found' });
  const { cmd } = req.body as { cmd: string };
  const r = await execCommand(s, cmd);
  res.json(r);
});