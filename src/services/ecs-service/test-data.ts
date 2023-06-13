import { World } from 'miniplex';
import { generate as genId } from 'short-uuid';
import { Entity, Arch } from '.';
import { UiObj, AI } from '../../common';
import { genLevel } from '../../common';

// Function to piece the generators together
export const addTestData = (world: World<Entity>) => {
  // create five levels
  for (let i = 0; i < 5; i++) {
    let level = genLevel();
    if (i == 0) {
      level.selected = true;
    }
    world.add(level);
    // Add ten uiobjs to the level
    for (let j = 0; j < 10; j++) {
      //world.add(genUiObj(level.dimensions.x, level.dimensions.y, level.id));
    }
  }
  console.log('generated ' + Arch.levels.entities.length + ' levels with ' + Arch.uiObj.entities.length + ' uiObjs');
};
