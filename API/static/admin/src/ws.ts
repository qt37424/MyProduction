import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

export function attachWS(httpServer: HttpServer){
  const io = new Server(httpServer, { path: '/ws', cors: { origin: '*' } });
  io.on('connection', (socket)=>{
    socket.emit('hello', 'connected');
  });
  return io;
}