import { db } from '../db.js';
import { randomUUID } from 'crypto';
import type { ServerItem } from '../types.js';

export async function listServers(): Promise<ServerItem[]> {
  const [rows] = await db.query('SELECT * FROM servers');
  return (rows as any[]).map(r => ({ ...r, tags: r.tags ? JSON.parse(r.tags) : [] }));
}

export async function getServer(id: string): Promise<ServerItem|null> {
  const [rows] = await db.query('SELECT * FROM servers WHERE id = ?', [id]);
  const r = (rows as any[])[0];
  return r ? { ...r, tags: r.tags ? JSON.parse(r.tags) : [] } : null;
}

export async function createServer(data: Omit<ServerItem,'id'>): Promise<ServerItem> {
  const id = randomUUID();
  await db.query(
    `INSERT INTO servers (id,name,host,port,username,authType,password,privateKeyPath,tags) 
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [id, data.name, data.host, data.port, data.username, data.authType, data.password, data.privateKeyPath || null, JSON.stringify(data.tags||[])]
  );
  return (await getServer(id))!;
}

export async function updateServer(id: string, patch: Partial<ServerItem>): Promise<ServerItem> {
  const s = await getServer(id);
  if (!s) throw new Error('Not found');
  const merged = { ...s, ...patch };
  await db.query(
    `UPDATE servers SET name=?,host=?,port=?,username=?,authType=?,password=?,privateKeyPath=?,tags=? WHERE id=?`,
    [merged.name, merged.host, merged.port, merged.username, merged.authType, merged.password, merged.privateKeyPath || null, JSON.stringify(merged.tags||[]), id]
  );
  return (await getServer(id))!;
}

export async function deleteServer(id: string){
  await db.query('DELETE FROM servers WHERE id=?', [id]);
}
