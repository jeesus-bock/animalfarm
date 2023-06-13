import { io, Socket } from 'socket.io-client';

import { EventTypes, User, Level, Animal } from '../../common';
import { EventBus } from '../event-bus';
import { View } from '../views/types';
import { UiService } from './ui-service';
import { LogService } from './log-service';
import { UserService } from './user-service';
import { LevelService } from './level-service';

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
      LevelService.getInstance().requestLevels();
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
    this.socket.on(EventTypes.RequestLevels, (levels: Array<Level>) => {
      addLogItem('[Socket] Received RequestLevel reply', levels);
      EventBus.getInstance().dispatch(EventTypes.RequestLevels, levels);
    });
    this.socket.on(EventTypes.GenerateLevel, (level: Level) => {
      addLogItem('[Socket] Received GenerateLevel reply', level);
      EventBus.getInstance().dispatch(EventTypes.GenerateLevel, level);
    });
    this.socket.on(EventTypes.CreateLevel, (level: Level) => {
      addLogItem('[Socket] Received CreateLevel reply', { ...level, matrix: [] });
      EventBus.getInstance().dispatch(EventTypes.CreateLevel, level);
    });
    this.socket.on(EventTypes.UpdateLevel, (level: Level) => {
      addLogItem('[Socket] Received UpdateLevel reply', { ...level, matrix: [] });
      EventBus.getInstance().dispatch(EventTypes.UpdateLevel, level);
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
  public requestLevels() {
    LogService.getInstance().addLogItem('[Socket] sending RequestLevels');
    if (!this.socket) throw new Error('Attempting to requestLevels with undefined socket');
    this.socket.emit(EventTypes.RequestLevels);
  }
  public generateLevel() {
    LogService.getInstance().addLogItem('[Socket] sending GenerateLEvel');
    if (!this.socket) throw new Error('Attempting to generateLevel with undefined socket');
    this.socket.emit(EventTypes.GenerateLevel);
  }
  public requestAnimal() {
    LogService.getInstance().addLogItem('[Socket] sending RequestAnimal');
    if (!this.socket) throw new Error('Attempting to RequestAnimal with undefined socket');
    this.socket.emit(EventTypes.RequestAnimal);
  }
  public updateLevel(level: Level) {
    LogService.getInstance().addLogItem('[Socket] sending UpdateLevel');
    if (!this.socket) throw new Error('Attempting to UpdateLevel with undefined socket');
    this.socket.emit(EventTypes.UpdateLevel, level);
  }
  public createLevel(level: Level) {
    LogService.getInstance().addLogItem('[Socket] sending CreateLevel');
    if (!this.socket) throw new Error('Attempting to CreateLevel with undefined socket');
    this.socket.emit(EventTypes.CreateLevel, level);
  }
}
