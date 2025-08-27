import express from 'express';
import { runCommand } from '../services/commands.js';

const router = express.Router();

// POST /api/commands/run
router.post('/run', async (req, res) => {
  try {
    const { serverId, command } = req.body;
    const result = await runCommand(serverId, command);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
