import { ECSService } from '.';
import { Level, Player, UiAnimal, UiObj } from '../../../common';
import { LogService } from '../log-service';

// Gets the uiObj ui entry at given coordinates or null if square is empty.
export const getUiEntAt = (x: number, y: number, level: string): UiObj | null => {
  const { Arch } = ECSService.getInstance();
  for (const ent of Arch.uiObj) {
    if (ent.position.x == x && ent.position.y == y && ent.level == level) {
      LogService.getInstance().addLogItem('[ECS] getUiEntAt returns', ent);
      return ent;
    }
  }
  return null;
};
export const getGroundAt = (x: number, y: number, levelId: string) => {
  const level = getLevel(levelId);
  if (!level) return 0;
  return level.matrix[y][x];
};

// Helper to get the width and height of current level as a tuple.
export const getLevelDimensions = (levelId: string): [number, number] => {
  const { Arch } = ECSService.getInstance();

  // Probably unnecessary check.
  for (const { dimensions, id } of Arch.levels) {
    if (id == levelId) return [dimensions.x, dimensions.y];
  }
  throw new Error('getLevelDimensions: No level found for id ' + levelId);
};

// This somewhat brutally casts an any to Level
export const getSelectedLevel = (): Level | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.selectedLevel) {
    return ent;
  }
  return null;
};
export const getLevel = (levelId: string): Level | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.levels) {
    if (ent.id == levelId) return ent;
  }
  return null;
};
// Get the selected UiObj or null if none selected.
export const getSelectedUiObj = (): UiObj | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.selectedUiObj) {
    return ent;
  }
  return null;
};
export const getSelectedUiAnimal = (): UiAnimal | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.selectedUiAnimal) {
    return ent;
  }
  return null;
};

// Get the selected UiObj or null if none selected.
export const getPlayer = (): Player | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.player) {
    return ent;
  }
  return null;
};
