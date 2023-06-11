import { ECSService } from '..';
import { LogService } from '../../log-service';
import { getUiEntAt, getGroundAt } from '../helpers';
// Adjusts the entities' positions according to their velocities.
export const moveSystem = () => {
  console.log('moveSystem');
  const { Arch } = ECSService.getInstance();
  LogService.getInstance().addLogItem('[ECS] moveSystem moving ' + Arch.moving.entities.length + ' entities.');
  for (const { position, velocity, map, isPlayer } of Arch.moving) {
    // Skip the still ones.
    if (velocity.x == 0 && velocity.y == 0) continue;

    if (getGroundAt(position.x + velocity.x, position.y + velocity.y, map) < 2) {
      LogService.getInstance().addLogItem("[ECS] moveSystem can't walk on ground" + (position.x + velocity.x) + '-' + (position.y + velocity.y));
      continue;
    }
    // Prevent moving on top of other entities.
    if (getUiEntAt(position.x + velocity.x, position.y + velocity.y, map)) {
      LogService.getInstance().addLogItem('[ECS] moveSystem bump' + (position.x + velocity.x) + '-' + (position.y + velocity.y));
      continue;
    }
    position.x += velocity.x;
    position.y += velocity.y;
    if (isPlayer) {
      velocity.y = 0;
      velocity.x = 0;
    }
  }
};
