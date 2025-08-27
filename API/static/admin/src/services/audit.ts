import { db } from '../db.js';

export type LogEntry = {
  ts: number;
  level: 'info'|'warn'|'error';
  message: string;
  meta?: any
};

export async function log(entry: LogEntry){
  const sql = `
    INSERT INTO audit (ts, level, message, meta)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    entry.ts,
    entry.level,
    entry.message,
    entry.meta ? JSON.stringify(entry.meta) : null
  ];

  await db.execute(sql, values);
}

export async function read(limit = 100){
  const sql = `
    SELECT ts, level, message, meta
    FROM audit
    ORDER BY ts DESC
    LIMIT ?
  `;

  const [rows] = await db.execute(sql, [limit]);

  return (rows as any[]).map(r => ({
    ts: Number(r.ts),
    level: r.level,
    message: r.message,
    meta: r.meta ? JSON.parse(r.meta) : undefined
  }));
}