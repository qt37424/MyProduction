import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/login', (req,res)=>{
  if (process.env.ALLOW_DEV_NO_AUTH === 'true'){
    return res.json({ token: 'dev-token' });
  }
  // TODO: real auth w/ JWT
  res.status(501).json({ error: 'Auth not implemented. Set ALLOW_DEV_NO_AUTH=true for dev.' });
});