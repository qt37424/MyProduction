import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { createAdminIfNotExists } from './services/users.service.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/users', usersRoutes);

const port = Number(process.env.PORT || 4000);

async function start() {
  await pool.query('SELECT 1');
  await createAdminIfNotExists();
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

start().catch((e) => {
  console.error('Failed to start API', e);
  process.exit(1);
});