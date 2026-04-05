import type { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from "jsonwebtoken";
import pool from '../db.js';
import { UserRole } from '../roles.js';

const options: SignOptions = { expiresIn: "1h" };

export async function findUserByUsername(username: string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, username, password_hash, role FROM users WHERE username=? LIMIT 1',
    [username]
  );
  return rows[0] as any | undefined;
}

export async function listUsers() {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, username, role FROM users ORDER BY id DESC'
  );
  return rows as any[];
}

export async function createUser(username: string, password: string, role: UserRole) {
  const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
  const hash = await bcrypt.hash(password, saltRounds);
  await pool.execute(
    'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
    [username, hash, role]
  );
}

export async function createAdminIfNotExists() {
  const adminUser = 'admin';
  const adminPass = 'admin123';
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM users WHERE username=?',
    [adminUser]
  );
  if (rows.length === 0) {
    await createUser(adminUser, adminPass, UserRole.ADMIN);
    // eslint-disable-next-line no-console
    console.log('Seeded default admin (admin/admin123). Change password ASAP.');
  }
}

export function issueToken(user: { id: number; role: UserRole }) {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn: "1h" };
  // const secret = process.env.JWT_SECRET!;
  // const expiresIn = process.env.JWT_EXPIRES || '7d';
  return jwt.sign({ id: user.id, role: user.role }, secret, options); // { expiresIn });
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}