import { Router } from 'express';
import { authenticate, authorize } from '../auth.js';
import { UserRole } from '../roles.js';
import { exportConnectionsCSV, listConnections, getBandwidth, listServers } from '../services/connections.service.js';

const router = Router();

router.get('/connections', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  const rows = await listConnections();
  res.json(rows);
});

router.get('/connections/export', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  const csv = await exportConnectionsCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="connections.csv"');
  res.send(csv);
});

router.get('/servers', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  const rows = await listServers();
  res.json(rows);
});

router.get('/servers/:id/bandwidth', authenticate, authorize(UserRole.ADMIN), async (req, res) => {
  const serverId = Number(req.params.id);
  const bw = await getBandwidth(serverId);
  if (!bw) return res.status(404).json({ message: 'Server not found' });
  res.json(bw);
});

export default router;