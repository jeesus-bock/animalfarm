import { AI, EventTypes, GenPlayer } from '../../common';
import { EventBus } from '../event-bus';

import { getSelectedMap, getPlayer } from './ecs-service/helpers';
import { ECSService } from './ecs-service';

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
      ECSService.getInstance().runSystems();
    });
  }
  public GeneratePlayer() {
    const selectedMap = getSelectedMap();
    if (!selectedMap) return;
    const { dimensions, id } = selectedMap;
    const obj = { ...GenPlayer(dimensions.x, dimensions.y, id), ai: AI.Player };
    ECSService.getInstance().setPlayer(obj);
  }
}
