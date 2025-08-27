export type ServerItem = {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  authType: 'password' | 'key';
  password?: string;       // store hashed in real life; plain for mock only
  privateKeyPath?: string; // for key auth (future)
  tags?: string[];
};