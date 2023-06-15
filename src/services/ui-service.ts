import van from '../van-0.11.10.min';
import { DiffDOM } from 'diff-dom';
import { EventBus } from '../event-bus';

import { View } from '../views/types';
import { LevelView } from '../views/level-view';
import { LoginView } from '../views/login-view';
import { AnimalsView } from '../views/animals-view';
import { LevelsView } from '../views/levels-view';
import { UsersView } from '../views/users-view';
import { LogsView } from '../views/logs-view';

import { EventTypes } from '../../common';
import { SocketService } from '../services/socket-service';
import { LogService } from './log-service';
import { UserService } from './user-service';
import { ECSService } from './ecs-service';

const { div } = van.tags;
const dd = new DiffDOM();
export class UiService {
  private static instance?: UiService = undefined;
  public static getInstance(): UiService {
    if (!this.instance) {
      this.instance = new UiService();
    }
    return this.instance;
  }
  constructor() {
    EventBus.getInstance().register(EventTypes.LevelUpdated, this.setLevelDiv);
    EventBus.getInstance().register(EventTypes.LevelAdded, this.refresh);
    EventBus.getInstance().register(EventTypes.GroundTypeSelected, this.setSelectedGroundType);
  }
  // Decoupling of ECS from the UI required me to have
  // this extra object with the level drawn by ECS.
  // Updated with UppdateLevel bus event.
  private levelDiv: HTMLDivElement | null = null;
  private selectedGroundType: number = 0;
  private setLevelDiv = (levelDiv: HTMLDivElement) => {
    if (this.levelDiv) {
      // DOMDiff library to see if the leveldiv has changed.
      const diff = dd.diff(this.levelDiv, levelDiv);
      if (diff.length == 0) return;
    }
    LogService.getInstance().addLogItem('[UiService] Setting levelDiv', levelDiv);
    this.levelDiv = levelDiv;
  };
  setSelectedGroundType = (groundType: number) => {
    this.selectedGroundType = groundType;
  };
  getSelectedGroundType = () => {
    return this.selectedGroundType;
  };
  // Refresh is just for the UI/routing for now.
  // by is for debug purposes, should these be cleared?
  public refresh(by?: string) {
    const t1 = performance.now();
    console.log('UiService.refresh()');

    // Empty the DOM
    document.body.innerHTML = '';
    if (window.location.pathname == View.Login) {
      van.add(document.body, LoginView());
      // Return early to not run code for the actual views.
      return;
    }
    // If we don't have a username and we aren't in the login-view, go to login-view.
    const userName = UserService.getInstance().getUser()?.name || '';
    if (!userName) this.navigateTo(View.Login);
    // connectSocket() bails out if the connection is present.
    SocketService.getInstance().connectSocket(userName);
    let view: any = div('Uknown route ' + window.location.pathname);
    if (window.location.pathname == View.Level) view = LevelView(this.levelDiv || div('loading'));
    if (window.location.pathname == View.Animals) view = AnimalsView();
    if (window.location.pathname == View.Levels) {
      view = LevelsView(this.levelDiv || div('loading'));
    }
    if (window.location.pathname == View.Users) view = UsersView();
    if (window.location.pathname == View.Logs) view = LogsView();
    van.add(document.body, view);
    LogService.getInstance().addLogItem('[UiService] refresh took ' + Math.round(performance.now() - t1) + 'ms.');
  }
  public navigateTo(view: View) {
    console.log('UiService.navigateTo', view);
    window.history.replaceState(null, '', view);
    if (window.location.pathname == View.Users) SocketService.getInstance().requestUsers();
    this.refresh('navigateTo');
  }
}
