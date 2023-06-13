import { User } from '../../common';
import { View } from '../views/types';
import { SocketService } from './socket-service';
import { StorageService } from './storage-service';
import { UiService } from './ui-service';

export class UserService {
  private static instance?: UserService = undefined;
  public static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }
  constructor() {
    console.log('UserService.constructor');
  }
  private userList: Array<User> = [];
  public setUser(user: User) {
    StorageService.getInstance().setUser(user);
  }
  public getUser() {
    return StorageService.getInstance().getUser();
  }
  public addUser(user: User) {
    console.log('UserService.addUser', user);
    this.userList.push(user);
  }
  public setUsers(users: Array<User>) {
    console.log('UserService.setUsers', users);
    this.userList = users || [];
  }
  public getUsers(): Array<User> {
    return this.userList || [];
  }
  public login = (name: string) => {
    // TODO: this could already call SocketService connector
    UserService.getInstance().setUser({ id: '', connected: 0, name: name });
    // Push the /level route
    UiService.getInstance().navigateTo(View.Level);
  };
  public logout = () => {
    StorageService.getInstance().unsetUser();
    SocketService.getInstance().disconnectSocket('logging out');
    UiService.getInstance().navigateTo(View.Login);
  };
}
