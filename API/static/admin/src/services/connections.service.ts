import pool from '../db.js';
import type { RowDataPacket } from 'mysql2';

export async function listConnections() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.id, c.server_id, c.ip_address, c.connected_at, c.disconnected_at,
            s.name as server_name
     FROM connections c
     JOIN servers s ON s.id = c.server_id
     ORDER BY c.connected_at DESC`
  );
  return rows as any[];
}

export async function exportConnectionsCSV() {
  const rows = await listConnections();
  const header = 'server_name,ip_address,connected_at,disconnected_at';
  const body = rows.map(r => (
    [r.server_name, r.ip_address, r.connected_at, r.disconnected_at ?? ''].join(',')
  ));
  return [header, ...body].join('\n');
}

export async function getBandwidth(serverId: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT bandwidth_limit, bandwidth_used, name FROM servers WHERE id=? LIMIT 1',
    [serverId]
  );
  if (rows.length === 0) return null;
  const { bandwidth_limit, bandwidth_used, name } = rows[0] as any;
  return {
    server: name,
    limit: Number(bandwidth_limit || 0),
    used: Number(bandwidth_used || 0),
    remaining: Number(bandwidth_limit || 0) - Number(bandwidth_used || 0),
  };
}

export async function listServers() {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, host, port, bandwidth_limit, bandwidth_used FROM servers ORDER BY id DESC'
  );
  return rows as any[];
}