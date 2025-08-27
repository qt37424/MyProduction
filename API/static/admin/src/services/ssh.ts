import { Client } from 'ssh2';
import type { ServerItem } from '../types.js';

const hasSsh2 = !!Client; // always true if installed, mock if connection fails

export async function pingServer(s: ServerItem): Promise<{ ok: boolean; reason?: string }>{
  if (!hasSsh2) return { ok: true, reason: 'mock-ssh enabled' };
  return new Promise((resolve)=>{
    const conn = new Client();
    const timer = setTimeout(()=>{
      try { conn.end(); } catch {}
      resolve({ ok:false, reason:'timeout' });
    }, 8000);
    conn.on('ready', ()=>{ clearTimeout(timer); conn.end(); resolve({ ok:true }); })
        .on('error', (err)=>{ clearTimeout(timer); resolve({ ok:false, reason: String(err.message||err) }); })
        .connect({
          host: s.host,
          port: s.port,
          username: s.username,
          password: s.authType==='password' ? s.password as string : "" as string,
          // TODO: privateKey for key auth
          readyTimeout: 7000,
        });
  });
}

export async function execCommand(s: ServerItem, cmd: string): Promise<{ exitCode:number; stdout:string; stderr:string }>{
  if (cmd.trim().startsWith('mock:')){
    return { exitCode:0, stdout:`MOCK ${cmd.slice(5).trim()}`, stderr:'' };
  }
  return new Promise((resolve)=>{
    const conn = new Client();
    let stdout = '';
    let stderr = '';
    conn.on('ready', ()=>{
      conn.exec(cmd, (err, stream)=>{
        if (err){ resolve({ exitCode:1, stdout:'', stderr:String(err) }); return; }
        stream.on('close', (code:number)=>{ conn.end(); resolve({ exitCode: code ?? 0, stdout, stderr }); })
              .on('data', (d:Buffer)=>{ stdout += d.toString(); })
              .stderr.on('data', (d:Buffer)=>{ stderr += d.toString(); });
      });
    }).on('error', (err)=>{
      resolve({ exitCode:1, stdout:'', stderr:String(err) });
    }).connect({ host: s.host, port: s.port, username: s.username, password: s.password as string });
  });
}