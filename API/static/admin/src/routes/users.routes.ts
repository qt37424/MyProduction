import { Router } from 'express';
import { authenticate, authorize } from '../auth.js';
import { UserRole } from '../roles.js';
import { createUser, listUsers } from '../services/users.service.js';

const router = Router();

router.get('/', authenticate, authorize(UserRole.ADMIN), async (_req, res) => {
  const rows = await listUsers();
  res.json(rows);
});

router.post('/', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  await createUser(username, password, role as UserRole);
  res.json({ ok: true });
});

export default router;