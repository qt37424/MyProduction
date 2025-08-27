import { Router } from 'express';
import { read } from '../services/audit.js';
export const logsRouter = Router();
logsRouter.get('/', (req,res)=>{ res.json(read(200)); });