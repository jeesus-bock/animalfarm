// This file has the ecs functionality built in. There's a lot of refactoring to do.
// Maybe do a class... or get rid of the other classes too, decicions decicions.

import { World } from 'miniplex';
import { EventBus } from '../../event-bus';
import { aiSystem } from './systems/ai-system';
import { moveSystem } from './systems/move-system';
import { uiSystem } from './systems/ui-system';
import { EventTypes, AI, Map, Animal, GenUiAnimal, Player } from '../../../common';
import { LogService } from '../log-service';
import { getSelectedMap } from './helpers';

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
  isPlayer?: boolean;
  isAnimal?: boolean;
  // Name and description of animal/map
  name?: string;
  description?: string;
  // The AI enum value, switched or iffed in the system.
  // This is pretty simple but works for poc purposes.
  ai?: AI;
}

export class ECSService {
  private static instance?: ECSService = undefined;
  public static getInstance(): ECSService {
    if (!this.instance) {
      this.instance = new ECSService();
    }
    return this.instance;
  }

  // The ECS world, contains everything else
  private world?: World<Entity> = undefined;
  // Archetypes, ie. collections of entities with given components(properties)
  public Arch: any;
  // Systems are just functions that do stuff to and with the entities
  // The order is important: first the ai does it's magic
  // Then we move the object accordingly,
  // and last we render the map with the objects on top.
  private systems = [aiSystem, moveSystem, uiSystem];

  // Counts ticks
  private systemRunCount = 0;
  // The rest of the stuff here could be put somewhere or ordered in nicer manner
  constructor() {
    this.world = new World<Entity>();
    this.Arch = {
      // UiObj ui entities, ie a letter or other utf glyph with color.
      // Could be icons too with some effort.
      uiObj: this.world.with('id', 'position', 'ui', 'map'),
      selectedUiObj: this.world.with('id', 'position', 'ui', 'map', 'selected'),
      player: this.world.with('id', 'position', 'ui', 'map', 'stats', 'isPlayer'),

      // Moving. Entities that can move.
      moving: this.world.with('position', 'velocity', 'map', 'isPlayer'),
      // Entities with AI, they make use of velocity and position components too.
      ai: this.world.with('velocity', 'ai', 'position', 'map'),
      // The map entities. Right now there's support for multiple maps of different sizes.
      maps: this.world.with('dimensions', 'isMap', 'name', 'id', 'matrix'),
      // Map currently selected, ie. visible.
      selectedMap: this.world.with('id', 'isMap', 'name', 'selected', 'dimensions', 'matrix'),
    };
  }

  // Has to be publicly available to run ticks on user input.ccccc
  public runSystems = () => {
    const t1 = performance.now();
    // Actually loop the systems
    for (const s of this.systems) {
      s();
    }
    this.systemRunCount++;
    // Run the logger only on every tenths tick not to flood the logs.
    if (this.systemRunCount % 10 == 0) {
      LogService.getInstance().addLogItem('[ECS] runSystems took ' + Math.round(performance.now() - t1) + 'ms.');
    }
  };

  // This is needed in the ui for now for testing changing of the maps.
  public getAllMaps = (): Array<Map> => {
    const maps = this.Arch.maps.entities;
    LogService.getInstance().addLogItem('[ECS] getAllMaps returning ' + maps.length + ' maps.');
    return maps;
  };
  public addMap = (map: Map) => {
    if (!this.world) throw new Error('ECSServive addMap world undefined');
    this.world.add(map);
    const maps = this.getAllMaps();
    if (maps.length == 1) ECSService.getInstance().selectMapEntity(map.id);
    EventBus.getInstance().dispatch(EventTypes.MapAdded);
  };
  public addAnimal = (animal: Animal) => {
    if (!this.world) throw new Error('ECSServive addAnimal world undefined');
    const selectedMap = getSelectedMap();
    this.world.add(animal);
    if (selectedMap) {
      this.world.addComponent(animal, 'position', { x: 2, y: 2 });
      this.world.addComponent(animal, 'map', selectedMap.id);
    }
    EventBus.getInstance().dispatch(EventTypes.MapAdded);
  };
  public setPlayer = (player: Player) => {
    if (!this.world) throw new Error('ECSServive setPlayer world undefined');
    const selectedMap = getSelectedMap();
    this.world.add(player);

    // Guard against situation where maps haven't been loaded
    if (selectedMap) {
      this.world.addComponent(player, 'position', { x: 2, y: 2 });
      this.world.addComponent(player, 'map', selectedMap.id);
    }
  };
  public addComponent(entity: Entity, component: string, value: any) {
    if (!this.world) throw new Error('ECSService addComponent world undefined');
    this.world?.addComponent(entity, component as any, value);
  }
  private unregisterTick: (() => void) | null = null;
  public ECSListen = (on: boolean) => {
    // Run systems on event bus 'tick' events.
    // These events come from the server.
    // Use ECSListen(false) to turn it off.
    if (on) {
      const { unregister } = EventBus.getInstance().register(EventTypes.Tick, this.runSystems);
      this.unregisterTick = unregister;
    }
    if (!on && this.unregisterTick) {
      this.unregisterTick();
      this.unregisterTick = null;
    }
    LogService.getInstance().addLogItem('[ECS] listen to Tick is ' + (on ? 'ON' : 'OFF') + '.');
  };

  private mapAdded = (map: Map) => {
    if (!this.world) throw new Error('ECSServive mapAdded world undefined');
    for (const ent of this.Arch.maps) {
      if (!ent.id || ent.id == map.id) {
        this.world.remove(ent);
        map.selected = true;
        map.isMap = true;
        this.world.add(map);
        for (let i = 0; i < 5; i++) this.world.add(GenUiAnimal(map.dimensions.x, map.dimensions.y, map.id));
        return;
      }
    }
  };

  // Sets all the maps in the ECS.
  // Done by first removing all the maps and then adding
  // the maps passed as parameter.
  public setMaps = (maps: Array<Map>) => {
    if (!this.world) throw new Error('ECSServive setMaps world undefined');
    for (const ent of this.Arch.maps) {
      this.world.remove(ent);
    }
    for (const map of maps) {
      this.world.add(map);
    }
  };
  // Helper to switch the selected component from map entity to another. If no
  // map entity is found to be selected it throws.
  public selectMapEntity = (id: string): void => {
    if (!this.world) throw new Error('ECSServive selectMapEntity world undefined');

    LogService.getInstance().addLogItem('[ECS] selecting map entity ' + id);
    let selected = false;
    // Loop thru all the maps.
    for (const ent of this.Arch.maps) {
      if (ent.id == id) {
        // Add the selected component to the chosen map.
        this.world.addComponent(ent, 'selected', true);
        LogService.getInstance().addLogItem('[ECS] selected map entity ' + id);

        selected = true;
      } else {
        // And remove the selected component from the rest of them
        this.world.removeComponent(ent, 'selected');
      }
      // Run uiSystem immediately to refresh the App.mapDiv object.
      uiSystem();
    }
    if (!selected) throw new Error('Failed to select map with the id ' + id);
  };

  // Selects a uiObj entity and deselects others.
  // Can be used to deselect the currently selected entity,
  // by passing an empty string.
  public selectUiObjEntity = (id: string): void => {
    if (!this.world) throw new Error('ECSServive selectUiObjEntity world undefined');

    // Loop thru all the uiObjs. Cant' destructure because we need
    // the entity object.
    for (const ent of this.Arch.uiObj) {
      if (id && ent.id == id) {
        // Add the selected component to the chosen map.
        this.world.addComponent(ent, 'selected', true);
        LogService.getInstance().addLogItem('[ECS] select UiObj entity', ent);
      } else {
        // And remove the selected component from the rest of them
        this.world.removeComponent(ent, 'selected');
      }
    }
  };
}
