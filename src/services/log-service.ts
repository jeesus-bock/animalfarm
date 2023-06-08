import { LogItem } from '../../common';
import { addLogItemRow } from '../views/logs-view';

export class LogService {
  private static instance?: LogService = undefined;
  public static getInstance(): LogService {
    if (!this.instance) {
      this.instance = new LogService();
    }
    return this.instance;
  }

  private logs: Array<LogItem> = [];

  constructor() {}

  public addLogItem = (msg: any, payload?: any) => {
    const logItem: LogItem = { time: Date.now(), msg: msg, payload: payload };
    this.logs.push(logItem);
    addLogItemRow(logItem);
  };
  public getLogs = () => {
    return this.logs;
  };
}
