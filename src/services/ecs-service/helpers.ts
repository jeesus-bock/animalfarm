import { ECSService } from '.';
import { Map, Player, UiAnimal, UiObj } from '../../../common';

// Gets the uiObj ui entry at given coordinates or null if square is empty.
export const getUiEntAt = (x: number, y: number, map: string): UiObj | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.uiObj) {
    if (ent.position.x == x && ent.position.y == y && ent.map == map) return ent;
  }
  return null;
};
export const getGroundAt = (x: number, y: number, mapId: string) => {
  const map = getMap(mapId);
  if (!map) return 0;
  return map.matrix[y][x];
};

// Helper to get the width and height of current map as a tuple.
export const getMapDimensions = (mapId: string): [number, number] => {
  const { Arch } = ECSService.getInstance();

  // Probably unnecessary check.
  for (const { dimensions, id } of Arch.maps) {
    if (id == mapId) return [dimensions.x, dimensions.y];
  }
  throw new Error('getMapDimensions: No map found for id ' + mapId);
};

// This somewhat brutally casts an any to Map
export const getSelectedMap = (): Map | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.selectedMap) {
    return ent;
  }
  return null;
};
export const getMap = (mapId: string): Map | null => {
  const { Arch } = ECSService.getInstance();

  for (const ent of Arch.maps) {
    if (ent.id == mapId) return ent;
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
