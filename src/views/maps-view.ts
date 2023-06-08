// View about the different maps which we do not yet have.
import van from '../van-0.11.10.min';

import { TopNav } from '../components/top-nav';

import { Arch, getAllMaps } from '../ecs';
import { getSelectedMap, selectMapEntity } from '../ecs/helpers';
import { MapService } from '../services/map-service';
import { UiService } from '../services/ui-service';
import { Map } from '../../common';
import { LogService } from '../services/log-service';
const { div, select, option, label, button, input } = van.tags;
let editedMap: Map | null = null;
export const MapsView = (mapDiv: HTMLDivElement) => {
  editedMap = getSelectedMap();

  return div({ className: 'maps-view' }, [
    TopNav(),
    div([
      label({ for: 'mapSelect' }, 'Select map: '),
      select(
        {
          name: 'mapSelect',
          onchange: (e: any) => {
            selectMap(e.target.value);
          },
          value: editedMap?.id || '',
        },
        [getAllMaps().map((m) => option({ value: m.id || '' }, m.name || ''))]
      ),
      button(
        {
          onclick: () => {
            MapService.getInstance().requestMap();
            UiService.getInstance().refresh();
          },
        },
        'Request map'
      ),
      button(
        {
          onclick: () => {
            MapService.getInstance().requestAnimal();
            UiService.getInstance().refresh();
          },
        },
        'Request animal'
      ),
      label('Name:'),
      input({
        value: editedMap && editedMap.name ? editedMap.name : 'not selected',
        oninput: (e: any) => {
          if (!editedMap) return;
          editedMap.name = e.target.value;
        },
      }),
      label('id: ' + editedMap?.id),
      button({ onclick: saveMap }, 'Save map'),
      button(
        {
          onclick: () => {
            UiService.getInstance().refresh();
          },
        },
        'Refresh'
      ),
    ]),
    div(JSON.stringify(Arch.uiObj.entities)),
    div({ class: 'map-container' }, mapDiv),
  ]);
};

const saveMap = () => {
  if (!editedMap) return;
  LogService.getInstance().addLogItem('maps-view saveMap', editedMap);
  MapService.getInstance().saveMap(editedMap);
};
// Call the ECS to select a map with the given id.
const selectMap = (id: string) => {
  selectMapEntity(id);
};
