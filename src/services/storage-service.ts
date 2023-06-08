import { LogItem, User } from '../../common';

export enum StorageItem {
  // Current User with id and name
  User = 'USER',
  Logs = 'LOGS',
}
export class StorageService {
  private static instance?: StorageService = undefined;
  public static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }
  constructor() {
    console.log('StorageService.constructor');
  }
  private setItem<T>(type: StorageItem, value: T): void {
    window.sessionStorage.setItem(type, JSON.stringify(value));
  }
  private getItem<T>(type: StorageItem): T | null {
    const strItem = window.sessionStorage.getItem(type);
    if (!strItem) return null;
    return JSON.parse(strItem);
  }

  // User helpers
  public setUser(user: User) {
    this.setItem(StorageItem.User, user);
  }
  public unsetUser() {
    window.sessionStorage.removeItem(StorageItem.User);
  }
  public getUser(): User | null {
    return this.getItem<User>(StorageItem.User);
  }

  // Log item helpers
  public setLogItems(items: Array<LogItem>) {
    this.setItem(StorageItem.Logs, items);
  }
  public getLogItems(): Array<LogItem> {
    const items = this.getItem<Array<LogItem>>(StorageItem.Logs);
    if (!items) return [];
    return items;
  }
  public addLogItem(item: LogItem) {
    const items = this.getLogItems();
    items.push(item);
    this.setLogItems(items);
  }
}
