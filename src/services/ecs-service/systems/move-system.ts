import { ECSService } from '..';
import { LogService } from '../../log-service';
import { getUiEntAt, getGroundAt } from '../helpers';
// Adjusts the entities' positions according to their velocities.
export const moveSystem = () => {
  console.log('moveSystem');
  const { Arch } = ECSService.getInstance();
  LogService.getInstance().addLogItem('[ECS] moveSystem moving ' + Arch.moving.entities.length + ' entities.');
  for (const { position, velocity, level, isPlayer } of Arch.moving) {
    // Skip the still ones.
    if (velocity.x == 0 && velocity.y == 0) continue;

    if (getGroundAt(position.x + velocity.x, position.y + velocity.y, level) < 2) {
      LogService.getInstance().addLogItem("[ECS] moveSystem can't walk on ground" + (position.x + velocity.x) + '-' + (position.y + velocity.y));
      continue;
    }
    // Prevent moving on top of other entities.
    if (getUiEntAt(position.x + velocity.x, position.y + velocity.y, level)) {
      LogService.getInstance().addLogItem('[ECS] moveSystem bump' + (position.x + velocity.x) + '-' + (position.y + velocity.y));
      continue;
    }
    LogService.getInstance().addLogItem('[ECS] moveSystem velocity ' + JSON.stringify(velocity));
    position.x += velocity.x;
    position.y += velocity.y;
    if (isPlayer) {
      velocity.y = 0;
      velocity.x = 0;
    }
  }
};
