import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { serversRouter } from './routes/servers.js';
import { logsRouter } from './routes/logs.js';
import { authRouter } from './routes/auth.js';
import { attachWS } from './ws.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/servers', serversRouter);
app.use('/api/logs', logsRouter);

const port = Number(process.env.PORT||5050);
const server = http.createServer(app);
attachWS(server);

server.listen(port, ()=>{
  console.log(`[api] listening on http://localhost:${port}`);
});