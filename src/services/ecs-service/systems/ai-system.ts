import { AI } from '../../../../common';
import { LogService } from '../../log-service';
import { getMapDimensions } from '../helpers';
import { ECSService } from '..';

// This system has a whole lot of potential for implementing something cool.
export const aiSystem = () => {
  LogService.getInstance().addLogItem('[ECS] aiSystem: ' + ECSService.getInstance().Arch.ai.entities.length + ' entities.');

  for (const { velocity, position, ai, map } of ECSService.getInstance().Arch.ai) {
    const [width, height] = getMapDimensions(map);

    // The only AI with implementation changes velocities of entities.
    // Blocks entities from going off grid.
    if (ai == AI.RndDir && Math.round(Math.random() * 2) == 1) {
      velocity.x = Math.round(Math.random() * 2) - 1;
      if (position.x == 1 && velocity.x < 0) velocity.x = 1;
      if (position.x == width - 1 && velocity.x > 0) velocity.x = -1;
      velocity.y = Math.round(Math.random() * 2) - 1;
      if (position.y == 1 && velocity.y < 0) velocity.y = 1;
      if (position.y == height - 1 && velocity.y > 0) velocity.y = -1;
    }
  }
};
