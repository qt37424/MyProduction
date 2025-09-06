export interface User {
  id: number;
  username: string;
  password_hash: string;
  role: 'admin' | 'user' | 'guest';
}

export interface ServerRow {
  id: number;
  name: string;
  host: string;
  port: number;
  bandwidth_limit: number; // bytes
  bandwidth_used: number;  // bytes
}

export interface ConnectionRow {
  id: number;
  server_id: number;
  ip_address: string;
  connected_at: string; // ISO from MySQL
  disconnected_at: string | null;
}