import van from '../../van-0.11.10.min';
import { getMapDimensions, getSelectedMap, getSelectedUiObj, getUiEntAt, selectUiObjEntity } from '../helpers';
import { EventTypes, UiObj } from '../../../common';
import { EventBus } from '../../event-bus';
import { UiService } from '../../services/ui-service';
import { View } from '../../views/types';
import { LogService } from '../../services/log-service';

const { div } = van.tags;

export const uiSystem = () => {
  // Get the dimensions of currently selected map.

  const curMap = getSelectedMap();
  if (!curMap) {
    LogService.getInstance().addLogItem('[ECS] uiSystem no selected map');
    return;
  }
  const selectedUiObj = getSelectedUiObj();
  const selectedUiObjId = selectedUiObj ? selectedUiObj.id : '';
  const [width, height] = getMapDimensions(curMap.id);
  if (width == 0 || height == 0) throw new Error('Current map ddimensions zero');
  // mapDiv is a flex column element.
  const mapDiv = div({ className: 'map' });
  for (let i = 0; i < height; i++) {
    // Each row is a flex row.
    let rowDiv = div({ className: 'row' });
    for (let j = 0; j < width; j++) {
      const ent = getUiEntAt(j, i, curMap.id);
      // char is a space by default
      let char = ' ';
      // If there is a uiObj on the position we use the character/glyph in the ui component.

      if (ent) char = ent.ui.char;

      // And the rows are filled with squares.
      van.add(
        rowDiv,
        div(
          {
            class: getSquareClass(curMap.matrix[i][j], ent, selectedUiObjId),
            // The ui component also defines color for the chars.
            // Implemented as simple style for now.
            style: 'color: ' + ent?.ui?.color,

            onclick: () => {
              // Bail out when clicking empty ground for now.
              if (!ent || !ent.id) return;
              // Add the selected component to entity that was clicked,
              // while removing it from the rest.

              selectUiObjEntity(ent.id);
              UiService.getInstance().refresh('square onclick');
            },
          },
          // At the moment the content of the map square is just a single letter.
          // This could be developed further in many ways, such as icons and stacking.
          char
        )
      );
    }
    van.add(mapDiv, rowDiv);
  }
  // send newly created mapDiv to EventBus.
  EventBus.getInstance().dispatch<HTMLDivElement>(EventTypes.MapUpdated, mapDiv);
};

const groundTypes = ['wall', 'water', 'grass', 'dirt', 'dirt2', 'dirt2'];
const getSquareClass = (groundType: number, ent: UiObj | null, selectedUiObjId: string): string => {
  let retClasses = ['square'];
  retClasses.push(groundTypes[groundType]);
  if (ent) retClasses.push('has-obj');
  if (ent && ent.id == selectedUiObjId) retClasses.push('selected');
  return retClasses.join(' ');
};
