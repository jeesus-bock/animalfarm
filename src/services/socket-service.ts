import { io, Socket } from 'socket.io-client';

import { EventTypes, User, Map, Animal } from '../../common';
import { EventBus } from '../event-bus';
import { View } from '../views/types';
import { UiService } from './ui-service';
import { LogService } from './log-service';
import { UserService } from './user-service';
import { MapService } from './map-service';

export class SocketService {
  private static instance?: SocketService = undefined;

  // Socket is optional as it isn't set yet in the login view.
  private socket?: Socket;

  constructor() {}
  public static getInstance(): SocketService {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }
  public connectSocket(userName: string): void {
    console.log('SocketService.connectSocket');
    const { addLogItem } = LogService.getInstance();
    if (this.socket) return;
    this.socket = io('localhost:8081', {
      auth: {
        name: userName,
      },
    });
    this.socket.on('connect', () => {
      const userObj = { id: this.socket?.id || '', connected: Date.now(), name: userName };
      addLogItem('[Socket] Connected to server', userObj);
      UserService.getInstance().setUser(userObj);
      MapService.getInstance().requestMaps();
    });
    this.socket.on(EventTypes.Enter, (user: User) => {
      LogService.getInstance().addLogItem('[Socket] Received Enter event', user);
      UserService.getInstance().addUser(user);
    });
    this.socket.on(EventTypes.Tick, () => {
      EventBus.getInstance().dispatch(EventTypes.Tick);
    });
    this.socket.on(EventTypes.RequestUsers, (users: Array<User>) => {
      addLogItem('[Socket] Received RequestUsers reply, user count: ' + users.length);
      UserService.getInstance().setUsers(users);
      if (window.location.pathname == View.Users) UiService.getInstance().refresh();
    });
    this.socket.on(EventTypes.RequestMaps, (maps: Array<Map>) => {
      addLogItem('[Socket] Received RequestMap reply', maps);
      EventBus.getInstance().dispatch(EventTypes.RequestMaps, maps);
    });
    this.socket.on(EventTypes.CreateMap, (map: Map) => {
      addLogItem('[Socket] Received CreateMap reply', { ...map, matrix: [] });
      EventBus.getInstance().dispatch(EventTypes.CreateMap, map);
    });
    this.socket.on(EventTypes.UpdateMap, (map: Map) => {
      addLogItem('[Socket] Received UpdateMap reply', { ...map, matrix: [] });
      EventBus.getInstance().dispatch(EventTypes.UpdateMap, map);
    });
    this.socket.on(EventTypes.RequestAnimal, (animal: Animal) => {
      addLogItem('[Socket] Received RequestAnimal reply', animal);
      EventBus.getInstance().dispatch(EventTypes.RequestAnimal, animal);
    });
  }

  public disconnectSocket = (reason: string) => {
    console.log('SocketService.disconnectSocket', reason);
    if (!this.socket) throw new Error('Attempting to disconnect undefined socket');
    this.socket.emit(EventTypes.Exit, reason);
  };
  public requestUsers() {
    LogService.getInstance().addLogItem('[Socket] sending RequestUsers');
    if (!this.socket) throw new Error('Attempting to requestUsers with undefined socket');
    this.socket.emit(EventTypes.RequestUsers);
  }
  public requestMaps() {
    LogService.getInstance().addLogItem('[Socket] sending RequestMaps');
    if (!this.socket) throw new Error('Attempting to requestMaps with undefined socket');
    this.socket.emit(EventTypes.RequestMaps);
  }
  public requestAnimal() {
    LogService.getInstance().addLogItem('[Socket] sending RequestAnimal');
    if (!this.socket) throw new Error('Attempting to RequestAnimal with undefined socket');
    this.socket.emit(EventTypes.RequestAnimal);
  }
  public updateMap(map: Map) {
    LogService.getInstance().addLogItem('[Socket] sending UpdateMap');
    if (!this.socket) throw new Error('Attempting to UpdateMap with undefined socket');
    this.socket.emit(EventTypes.UpdateMap, map);
  }
  public createMap(map: Map) {
    LogService.getInstance().addLogItem('[Socket] sending CreateMap');
    if (!this.socket) throw new Error('Attempting to CreateMap with undefined socket');
    this.socket.emit(EventTypes.CreateMap, map);
  }
}
