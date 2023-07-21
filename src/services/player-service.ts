import { AI, EventTypes, GenPlayer } from '../../common';
import { EventBus } from '../event-bus';

import { getSelectedLevel, getPlayer } from './ecs-service/helpers';
import { ECSService } from './ecs-service';
import { LogService } from './log-service';

export class PlayerService {
  private static instance?: PlayerService = undefined;
  public static getInstance(): PlayerService {
    if (!this.instance) {
      this.instance = new PlayerService();
    }
    return this.instance;
  }
  constructor() {
    // handle the keydown. TODO move this to player-service.
    EventBus.getInstance().register(EventTypes.KeyDown, (key: string) => {
      alert(key);
      let player = getPlayer();
      if (!player) return;
      if (!player.velocity) ECSService.getInstance().addComponent(player, 'velocity', { x: 0, y: 0 });
      player = getPlayer();
      if (!player) return;
      if (!player.velocity) return;

      if (key == 'ArrowUp') {
        player.velocity.y = -1;
        player.velocity.x = 0;
      }
      if (key == 'ArrowDown') {
        player.velocity.y = 1;
        player.velocity.x = 0;
      }
      if (key == 'ArrowLeft') {
        player.velocity.x = -1;
        player.velocity.y = 0;
      }
      if (key == 'ArrowRight') {
        player.velocity.x = 1;
        player.velocity.y = 0;
      }
      LogService.getInstance().addLogItem('[PlayerService] keyDown event ' + key);
      ECSService.getInstance().runSystems();
    });
  }
  public GeneratePlayer() {
    const selectedLevel = getSelectedLevel();
    if (!selectedLevel) return;
    const { dimensions, id } = selectedLevel;
    const obj = { ...GenPlayer(dimensions.x, dimensions.y, id), ai: AI.Player };
    ECSService.getInstance().setPlayer(obj);
  }
}
