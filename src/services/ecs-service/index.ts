// This file has the ecs functionality built in. There's a lot of refactoring to do.
// Maybe do a class... or get rid of the other classes too, decicions decicions.

import { World } from 'miniplex';
import { EventBus } from '../../event-bus';
import { aiSystem } from './systems/ai-system';
import { moveSystem } from './systems/move-system';
import { uiSystem } from './systems/ui-system';
import { EventTypes, AI, Level, Animal, GenUiAnimal, Player } from '../../../common';
import { LogService } from '../log-service';
import { getSelectedLevel } from './helpers';

// The ECS entity with components as props.
// All are optional because the entities have just a subset of the
// This has the potential of becoming huge so it might make sense
// to compose it of subparts.
export interface Entity {
  // This could possibly be required value?
  id?: string;

  // The level the entity is on
  level?: string;
  // and the position on it.
  position?: { x: number; y: number };
  stats?: { att: number; def: number };
  health?: { hp: number; maxHp: number };
  // The UI appearance of the entity
  ui?: { char: string; color: string };
  // Entities that are selected have this component.
  // At the moment it refers to selected UI entities.
  // For the levels this works okay, but when drawing uiobjs on the
  // level it feels wrong the selected uiobj isn't there.
  selected?: boolean;
  velocity?: { x: number; y: number };
  // This is the width and height of the entity (level, but possibly has uses for for example area-of-effect type of stuff)
  dimensions?: { x: number; y: number };
  // For now the level layout consists of 2d array of numbers.
  matrix?: Array<Array<number>>;
  // Instead of type-component and filtering, we can use boolean component to narrow down the archetype entities, entities that
  // are a level in this particular case.
  // Not sure if this is the best way to do this.
  isLevel?: boolean;
  isPlayer?: boolean;
  isAnimal?: boolean;
  // Name and description of animal/level
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
  // and last we render the level with the objects on top.
  private systems = [aiSystem, moveSystem, uiSystem, uiSystem];

  // Counts ticks
  private systemRunCount = 0;
  // The rest of the stuff here could be put somewhere or ordered in nicer manner
  constructor() {
    this.world = new World<Entity>();
    this.Arch = {
      // UiObj ui entities, ie a letter or other utf glyph with color.
      // Could be icons too with some effort.
      uiObj: this.world.with('id', 'position', 'ui', 'level'),
      selectedUiObj: this.world.with('id', 'position', 'ui', 'level', 'selected'),
      selectedUiAnimal: this.world.with('id', 'name', 'ai', 'stats', 'health', 'position', 'ui', 'level', 'selected'),
      player: this.world.with('id', 'position', 'ui', 'level', 'stats', 'isPlayer'),

      // Moving. Entities that can move.
      moving: this.world.with('position', 'velocity', 'level'),
      // Entities with AI, they make use of velocity and position components too.
      ai: this.world.with('velocity', 'ai', 'position', 'level'),
      // The level entities. Right now there's support for multiple levels of different sizes.
      levels: this.world.with('dimensions', 'isLevel', 'name', 'id', 'matrix'),
      // Level currently selected, ie. visible.
      selectedLevel: this.world.with('id', 'isLevel', 'name', 'selected', 'dimensions', 'matrix'),
    };
    EventBus.getInstance().register(EventTypes.GenerateLevel, this.levelAdded);
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

  // This is needed in the ui for now for testing changing of the levels.
  public getAllLevels = (): Array<Level> => {
    const levels = this.Arch.levels.entities;
    LogService.getInstance().addLogItem('[ECS] getAllLevels returning ' + levels.length + ' levels.');
    return levels;
  };
  public addLevel = (level: Level) => {
    if (!this.world) throw new Error('ECSServive addLevel world undefined');
    this.world.add(level);
    const levels = this.getAllLevels();
    if (levels.length == 1) ECSService.getInstance().selectLevelEntity(level.id);
    EventBus.getInstance().dispatch(EventTypes.LevelAdded);
  };
  public addAnimal = (animal: Animal) => {
    if (!this.world) throw new Error('ECSServive addAnimal world undefined');
    const selectedLevel = getSelectedLevel();
    this.world.add(animal);
    if (selectedLevel) {
      this.world.addComponent(animal, 'position', { x: 2, y: 2 });
      this.world.addComponent(animal, 'level', selectedLevel.id);
    }
    uiSystem();
    EventBus.getInstance().dispatch(EventTypes.LevelAdded);
  };
  public setPlayer = (player: Player) => {
    if (!this.world) throw new Error('ECSServive setPlayer world undefined');
    const selectedLevel = getSelectedLevel();
    this.world.add(player);

    // Guard against situation where levels haven't been loaded
    if (selectedLevel) {
      this.world.addComponent(player, 'position', { x: 2, y: 2 });
      this.world.addComponent(player, 'level', selectedLevel.id);
    }
    uiSystem();
  };
  public addComponent(entity: Entity, component: string, value: any) {
    if (!this.world) throw new Error('ECSService addComponent world undefined');
    this.world?.addComponent(entity, component as any, value);
  }

  private levelAdded = (level: Level) => {
    if (!this.world) throw new Error('ECSServive levelAdded world undefined');
    LogService.getInstance().addLogItem('[ECS] level added', level);
    if (this.Arch.levels.entities.length > 0) {
      for (const ent of this.Arch.levels) {
        if (!ent.id || ent.id == level.id) {
          this.world.remove(ent);
          level.selected = true;
          level.isLevel = true;
          this.world.add(level);
          this.selectLevelEntity(level.id);
          for (let i = 0; i < 5; i++) this.world.add(GenUiAnimal(level.dimensions.x, level.dimensions.y, level.id));
          return;
        }
      }
    }
    level.selected = true;
    level.isLevel = true;
    this.world.add(level);
    this.selectLevelEntity(level.id);
    LogService.getInstance().addLogItem('[ECS] selectLevelEntity', level);
  };

  // Sets all the levels in the ECS.
  // Done by first removing all the levels and then adding
  // the levels passed as parameter.
  public setLevels = (levels: Array<Level>) => {
    if (!this.world) throw new Error('ECSServive setLevels world undefined');
    for (const ent of this.Arch.levels) {
      this.world.remove(ent);
    }
    for (const level of levels) {
      this.world.add(level);
    }
  };
  // Helper to switch the selected component from level entity to another. If no
  // level entity is found to be selected it throws.
  public selectLevelEntity = (id: string): void => {
    if (!this.world) throw new Error('ECSServive selectLevelEntity world undefined');

    LogService.getInstance().addLogItem('[ECS] selecting level entity ' + id);
    let selected = false;
    // Loop thru all the levels.
    for (const ent of this.Arch.levels) {
      if (ent.id == id) {
        // Add the selected component to the chosen level.
        this.world.addComponent(ent, 'selected', true);
        LogService.getInstance().addLogItem('[ECS] selected level entity ' + id);

        selected = true;
      } else {
        // And remove the selected component from the rest of them
        this.world.removeComponent(ent, 'selected');
      }
      // Run uiSystem immediately to refresh the App.levelDiv object.
      uiSystem();
    }
    if (!selected) throw new Error('Failed to select level with the id ' + id);
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
        // Add the selected component to the chosen level.
        this.world.addComponent(ent, 'selected', true);
        LogService.getInstance().addLogItem('[ECS] select UiObj entity', ent);
      } else {
        // And remove the selected component from the rest of them
        this.world.removeComponent(ent, 'selected');
      }
    }
  };
}
