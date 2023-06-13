// Socket.io server. The generic idea is to work as a socket gateway to http-based data-server.
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { EventTypes, User, Level } from '../common';
import { FRONT_END_PORT, SOCKET_SERVER_PORT } from '../common';
import { fetchGenLevel, fetchLevels, postLevel } from './fetch';
interface ServerToClientEvents {
  [EventTypes.Tick]: () => void;
  [EventTypes.Exit]: (a: string) => void;
  [EventTypes.RequestUsers]: (a: Array<User>) => void;
}
const app = express();
const server = http.createServer(app);

const users: Array<User> = [];
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:' + FRONT_END_PORT,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: any) => {
  console.log('Connection from:', socket.id, socket.handshake.auth.name);
  if (users.find((u) => u.name == socket.handshake.auth.name)) {
    console.log('Name ' + socket.handshake.auth.name + ' already in use');
    socket.emit(EventTypes.NameInUse);
    socket.disconnect();
    return;
  }
  const user: User = { id: socket.id, name: socket.handshake.auth.name, connected: Date.now() };
  users.push(user);
  socket.emit(EventTypes.Enter, user);
  socket.on('disconnect', () => {
    users.splice(
      users.findIndex((u) => (u.id = socket.id)),
      1
    );
  });
  socket.on(EventTypes.Exit, (reason: string) => {
    console.log('Received Exit event: ', socket.handshake.auth.name, reason);
    socket.disconnect();
  });
  socket.on(EventTypes.RequestUsers, () => {
    console.log('Received RequestsUsers event: ', socket.handshake.auth.name, users);
    socket.emit(EventTypes.RequestUsers, users);
  });

  // These handlers receive an event, contact the data server for operations
  // and return the same event with data as payload.
  socket.on(EventTypes.GenerateLevel, async () => {
    console.log('Received RequestLevel event: ', socket.handshake.auth.name);
    const level = await fetchGenLevel();
    console.log(JSON.stringify(level));
    socket.emit(EventTypes.GenerateLevel, level);
  });
  socket.on(EventTypes.RequestLevels, async () => {
    console.log('Received RequestLevels event: ', socket.handshake.auth.name);
    const levels = await fetchLevels();
    console.log(JSON.stringify(levels));
    socket.emit(EventTypes.RequestLevels, levels);
  });
  socket.on(EventTypes.CreateLevel, async (level: Level) => {
    console.log('Received CreateLevel event: ', socket.handshake.auth.name);
    const response = await postLevel(level);
    console.log(JSON.stringify(response));
    socket.emit(EventTypes.CreateLevel, response);
  });
});

setInterval(() => {
  io.emit(EventTypes.Tick);
}, 500);

server.listen(SOCKET_SERVER_PORT, () => {
  console.log('listening on *:' + SOCKET_SERVER_PORT);
});
