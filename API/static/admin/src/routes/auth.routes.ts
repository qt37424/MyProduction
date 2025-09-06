import { Router } from 'express';
import { findUserByUsername, verifyPassword, issueToken } from '../services/users.service.js';
import { UserRole } from '../roles.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });

  const user = await findUserByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid username or password' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid username or password' });

  const token = issueToken({ id: user.id, role: user.role as UserRole });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

export default router;