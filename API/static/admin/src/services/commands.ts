import { Client } from 'ssh2';
import { getServer } from './inventory.js';
import type { ServerItem } from '../types.js';

export interface CommandResult {
  stdout: string;
  stderr: string;
  code: number | null;
}

export async function runCommand(serverId: string, command: string): Promise<CommandResult> {
  const server: ServerItem | null = await getServer(serverId);
  if (!server) throw new Error(`Server ${serverId} not found`);

  return new Promise((resolve, reject) => {
    const conn = new Client();
    let stdout = '';
    let stderr = '';

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        stream.on('close', (code: number) => {
          conn.end();
          resolve({ stdout, stderr, code });
        }).on('data', (data: Buffer) => {
          stdout += data.toString();
        }).stderr.on('data', (data: Buffer) => {
          stderr += data.toString();
        });
      });
    });

    conn.on('error', (err) => {
      reject(err);
    });

    conn.connect({
      host: server.host,
      port: server.port,
      username: server.username,
      ...(server.authType === 'password'
        ? { password: server.password as string }
        : { privateKey: require('fs').readFileSync(server.privateKeyPath || '') }
      ),
    });
  });
}
