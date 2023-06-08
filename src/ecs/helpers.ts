import { Arch, world } from '.';
import { Map, UiObj } from '../../common';
import { LogService } from '../services/log-service';

import { uiSystem } from './systems/ui-system';

// Gets the uiObj ui entry at given coordinates or null if square is empty.
export const getUiEntAt = (x: number, y: number, map: string): UiObj | null => {
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
  // Probably unnecessary check.
  for (const { dimensions, id } of Arch.maps) {
    if (id == mapId) return [dimensions.x, dimensions.y];
  }
  throw new Error('getMapDimensions: No map found for id ' + mapId);
};

// This somewhat brutally casts an any to Map
export const getSelectedMap = (): Map | null => {
  for (const ent of Arch.selectedMap) {
    return ent;
  }
  return null;
};
export const getMap = (mapId: string): Map | null => {
  for (const ent of Arch.maps) {
    if (ent.id == mapId) return ent;
  }
  return null;
};
// Get the selected UiObj or null if none selected.
export const getSelectedUiObj = (): UiObj | null => {
  for (const ent of Arch.selectedUiObj) {
    return ent;
  }
  return null;
};

// Helper to switch the selected component from map entity to another. If no
// map entity is found to be selected it throws.
export const selectMapEntity = (id: string): void => {
  LogService.getInstance().addLogItem('[ECS] selecting map entity ' + id);
  let selected = false;
  // Loop thru all the maps.
  for (const ent of Arch.maps) {
    if (ent.id == id) {
      // Add the selected component to the chosen map.
      world.addComponent(ent, 'selected', true);
      LogService.getInstance().addLogItem('[ECS] selected map entity ' + id);

      selected = true;
    } else {
      // And remove the selected component from the rest of them
      world.removeComponent(ent, 'selected');
    }
    // Run uiSystem immediately to refresh the App.mapDiv object.
    uiSystem();
  }
  if (!selected) throw new Error('Failed to select map with the id ' + id);
};

// Selects a uiObj entity and deselects others.
// Can be used to deselect the currently selected entity,
// by passing an empty string.
export const selectUiObjEntity = (id: string): void => {
  // Loop thru all the uiObjs. Cant' destructure because we need
  // the entity object.
  for (const ent of Arch.uiObj) {
    if (id && ent.id == id) {
      // Add the selected component to the chosen map.
      world.addComponent(ent, 'selected', true);
      LogService.getInstance().addLogItem('[ECS] select UiObj entity', ent);
    } else {
      // And remove the selected component from the rest of them
      world.removeComponent(ent, 'selected');
    }
  }
};
