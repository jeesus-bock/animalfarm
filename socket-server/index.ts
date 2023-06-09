// Socket.io server. The generic idea is to work as a socket gateway to http-based data-server.
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { EventTypes, User, Map } from '../common';
import { FRONT_END_PORT, SOCKET_SERVER_PORT } from '../common';
import { fetchGenMap, fetchMaps, postMap } from './fetch';
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
  socket.on(EventTypes.GenerateMap, async () => {
    console.log('Received RequestMap event: ', socket.handshake.auth.name);
    const map = await fetchGenMap();
    console.log(JSON.stringify(map));
    socket.emit(EventTypes.GenerateMap, map);
  });
  socket.on(EventTypes.RequestMaps, async () => {
    console.log('Received RequestMaps event: ', socket.handshake.auth.name);
    const maps = await fetchMaps();
    console.log(JSON.stringify(maps));
    socket.emit(EventTypes.RequestMaps, maps);
  });
  socket.on(EventTypes.CreateMap, async (map: Map) => {
    console.log('Received CreateMap event: ', socket.handshake.auth.name);
    const response = await postMap(map);
    console.log(JSON.stringify(response));
    socket.emit(EventTypes.CreateMap, response);
  });
});

setInterval(() => {
  io.emit(EventTypes.Tick);
}, 500);

server.listen(SOCKET_SERVER_PORT, () => {
  console.log('listening on *:' + SOCKET_SERVER_PORT);
});
