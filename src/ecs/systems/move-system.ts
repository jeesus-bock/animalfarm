import { Arch } from '..';
import { LogService } from '../../services/log-service';
import { getUiEntAt, getGroundAt } from '../helpers';
// Adjusts the entities' positions according to their velocities.
export const moveSystem = () => {
  console.log('moveSystem');
  LogService.getInstance().addLogItem('[ECS] moveSystem moving ' + Arch.moving.entities.length + ' entities.');
  for (const { position, velocity, map } of Arch.moving) {
    // Skip the still ones.
    if (velocity.x == 0 && velocity.y == 0) continue;

    // Prevent moving on top of other entities.
    if (getUiEntAt(position.x + velocity.x, position.y + velocity.y, map) || getGroundAt(position.x + velocity.x, position.y + velocity.y, map) < 2) {
      LogService.getInstance().addLogItem('[ECS] moveSystem bump' + (position.x + velocity.x) + '-' + (position.y + velocity.y));
      continue;
    }
    position.x += velocity.x;
    position.y += velocity.y;
  }
};
