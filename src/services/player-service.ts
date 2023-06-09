import { AI, Animal, EventTypes, GenUiObj, Map } from '../../common';
import { EventBus } from '../event-bus';
import { LogService } from './log-service';
import { SocketService } from './socket-service';
import { setMaps, addAnimal, addPlayer } from '../ecs';
import { getSelectedMap } from '../ecs/helpers';

export class PlayerService {
  private static instance?: PlayerService = undefined;
  public static getInstance(): PlayerService {
    if (!this.instance) {
      this.instance = new PlayerService();
    }
    return this.instance;
  }
  constructor() {}
  generatePlayer() {
    const selectedMap = getSelectedMap();
    if (!selectedMap) return;
    const { dimensions, id } = selectedMap;
    const obj = { ...GenUiObj(dimensions.x, dimensions.y, id), ai: AI.Still, isPlayer: true };
    addPlayer(obj);
  }
}
