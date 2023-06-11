import { World } from 'miniplex';
import { generate as genId } from 'short-uuid';
import { Entity, Arch } from '.';
import { UiObj, AI } from '../../common';
import { genMap } from '../../common';

// Function to piece the generators together
export const addTestData = (world: World<Entity>) => {
  // create five maps
  for (let i = 0; i < 5; i++) {
    let map = genMap();
    if (i == 0) {
      map.selected = true;
    }
    world.add(map);
    // Add ten uiobjs to the map
    for (let j = 0; j < 10; j++) {
      //world.add(genUiObj(map.dimensions.x, map.dimensions.y, map.id));
    }
  }
  console.log('generated ' + Arch.maps.entities.length + ' maps with ' + Arch.uiObj.entities.length + ' uiObjs');
};
