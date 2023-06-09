// This file has the ecs functionality built in. There's a lot of refactoring to do.
// Maybe do a class... or get rid of the other classes too, decicions decicions.

import { World } from 'miniplex';
import { EventBus } from '../event-bus';
import { aiSystem } from './systems/ai-system';
import { moveSystem } from './systems/move-system';
import { uiSystem } from './systems/ui-system';
import { addTestData } from './test-data';
import { EventTypes, AI, Map, Animal, GenUiObj, UiObj } from '../../common';
import { LogService } from '../services/log-service';
import { getPlayer, getSelectedMap, selectMapEntity } from './helpers';

// The ECS entity with components as props.
// All are optional because the entities have just a subset of the
// This has the potential of becoming huge so it might make sense
// to compose it of subparts.
export interface Entity {
  // This could possibly be required value?
  id?: string;

  // The map the entity is on
  map?: string;
  // and the position on it.
  position?: { x: number; y: number };
  stats?: { att: number; def: number };
  health?: { hp: number; maxHp: number };
  // The UI appearance of the entity
  ui?: { char: string; color: string };
  // Entities that are selected have this component.
  // At the moment it refers to selected UI entities.
  // For the maps this works okay, but when drawing uiobjs on the
  // map it feels wrong the selected uiobj isn't there.
  selected?: boolean;
  velocity?: { x: number; y: number };
  // This is the width and height of the entity (map, but possibly has uses for for example area-of-effect type of stuff)
  dimensions?: { x: number; y: number };
  // For now the map layout consists of 2d array of numbers.
  matrix?: Array<Array<number>>;
  // Instead of type-component and filtering, we can use boolean component to narrow down the archetype entities, entities that
  // are a map in this particular case.
  // Not sure if this is the best way to do this.
  isMap?: boolean;
  // Name and description of animal/map
  name?: string;
  description?: string;
  // The AI enum value, switched or iffed in the system.
  // This is pretty simple but works for poc purposes.
  ai?: AI;
}

// The ECS world, contains everything else
export const world = new World<Entity>();

// Archetypes, ie. collections of entities with given components(properties)
// This used to be just an object of the type any, but the .withs couldn't reference
// the object itself. I need to look into this separation too.
export class Arch {
  // UiObj ui entities, ie a letter or other utf glyph with color.
  // Could be icons too with some effort.
  public static uiObj = world.with('id', 'position', 'ui', 'map');
  public static selectedUiObj = world.with('id', 'position', 'ui', 'map', 'selected');
  public static player = world.with('id', 'position', 'ui', 'map', 'isPlayer');

  // Moving. Entities that can move.
  public static moving = world.with('position', 'velocity', 'map', 'isPlayer');
  // Entities with AI, they make use of velocity and position components too.
  public static ai = world.with('velocity', 'ai', 'position', 'map');
  // The map entities. Right now there's support for multiple maps of different sizes.
  public static maps = world.with('dimensions', 'isMap', 'name', 'id', 'matrix');
  // Map currently selected, ie. visible.
  public static selectedMap = world.with('id', 'isMap', 'name', 'selected', 'dimensions', 'matrix');
}

// Systems are just functions that do stuff to and with the entities
const systems = [aiSystem, moveSystem, uiSystem];

let systemRunCount = 0;
// The rest of the stuff here could be put somewhere or ordered in nicer manner
const runSystems = () => {
  const t1 = performance.now();
  for (const s of systems) {
    s();
  }
  systemRunCount++;
  if (systemRunCount > 3) {
    systemRunCount = 0;
    LogService.getInstance().addLogItem('[ECS] runSystems took ' + Math.round(performance.now() - t1) + 'ms.');
  }
};

// Add some test data.
// commented out to test fetching maps
//addTestData(world);

// This is needed in the ui for now for testing changing of the maps.
export const getAllMaps = (): Array<Map> => {
  const maps = Arch.maps.entities;
  LogService.getInstance().addLogItem('[ECS] getAllMaps returning ' + maps.length + ' maps.');
  return maps;
};
export const addMap = (map: Map) => {
  world.add(map);
  const maps = getAllMaps();
  if (maps.length == 1) selectMapEntity(map.id);
  EventBus.getInstance().dispatch(EventTypes.MapAdded);
};
export const addAnimal = (animal: Animal) => {
  const selectedMap = getSelectedMap();
  world.add(animal);
  if (selectedMap) {
    world.addComponent(animal, 'position', { x: 2, y: 2 });
    world.addComponent(animal, 'map', selectedMap.id);
  }
  EventBus.getInstance().dispatch(EventTypes.MapAdded);
};
export const addPlayer = (uiObj: UiObj) => {
  const selectedMap = getSelectedMap();
  world.add(uiObj);
  if (selectedMap) {
    world.addComponent(uiObj, 'position', { x: 2, y: 2 });
    world.addComponent(uiObj, 'map', selectedMap.id);
  }
};

let unregisterTick: (() => void) | null = null;
export const ECSListen = (on: boolean) => {
  // Run systems on event bus 'tick' events.
  // These events come from the server.
  // Use ECSListen(false) to turn it off.
  if (on) {
    const { unregister } = EventBus.getInstance().register(EventTypes.Tick, runSystems);
    unregisterTick = unregister;
  }
  if (!on && unregisterTick) {
    unregisterTick();
    unregisterTick = null;
  }
  LogService.getInstance().addLogItem('[ECS] listen to Tick is ' + (on ? 'ON' : 'OFF') + '.');
};

// handle the keydown. TODO move this to player-service.
EventBus.getInstance().register(EventTypes.KeyDown, (key: string) => {
  let player = getPlayer();
  if (!player) return;
  if (!player.velocity) world.addComponent(player, 'velocity', { x: 0, y: 0 });
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
  runSystems();
});
export const mapAdded = (map: Map) => {
  for (const ent of Arch.maps) {
    if (!ent.id || ent.id == map.id) {
      world.remove(ent);
      map.selected = true;
      map.isMap = true;
      world.add(map);
      for (let i = 0; i < 5; i++) world.add(GenUiObj(map.dimensions.x, map.dimensions.y, map.id));
      return;
    }
  }
};

// Sets all the maps in the ECS.
// Done by first removing all the maps and then adding
// the maps passed as parameter.
export const setMaps = (maps: Array<Map>) => {
  for (const ent of Arch.maps) {
    world.remove(ent);
  }
  for (const map of maps) {
    world.add(map);
  }
};
