// View about the different maps which we do not yet have.
import van from '../van-0.11.10.min';

import { TopNav } from './components/top-nav';

import { getSelectedMap } from '../services/ecs-service/helpers';
import { MapService } from '../services/map-service';
import { UiService } from '../services/ui-service';
import { EventTypes, Map } from '../../common';
import { LogService } from '../services/log-service';
import { PlayerService } from '../services/player-service';
import { ECSService } from '../services/ecs-service';
import { AnimalService } from '../services/animal-service';
import { EventBus } from '../event-bus';
const { div, select, option, label, button, input } = van.tags;
let editedMap: Map | null = null;
let mapContainer = div();
const editedId = van.state<string | undefined>('pekka');

export const MapsView = (mapDiv: HTMLDivElement) => {
  editedMap = getSelectedMap();
  editedId.val = editedMap?.id.toString();
  mapContainer = div({ class: 'map-container' }, mapDiv);
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
          value: editedId.val || 'jaska',
        },
        [
          ECSService.getInstance()
            .getAllMaps()
            .map((m) => option({ value: m.id || '' }, m.name || '')),
        ]
      ),
      button(
        {
          onclick: () => {
            MapService.getInstance().requestMaps();
            UiService.getInstance().refresh();
          },
        },
        'Request map'
      ),
      button(
        {
          onclick: () => {
            PlayerService.getInstance().GeneratePlayer();

            UiService.getInstance().refresh();
          },
        },
        'Request player'
      ),
      button(
        {
          onclick: () => {
            AnimalService.getInstance().GenerateAnimal();
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
    div(JSON.stringify(ECSService.getInstance().Arch.player.entities)),
    mapContainer,
  ]);
};

const saveMap = () => {
  if (!editedMap) return;
  LogService.getInstance().addLogItem('maps-view saveMap', editedMap);
  MapService.getInstance().saveMap(editedMap);
};
// Call the ECS to select a map with the given id.
const selectMap = (id: string) => {
  ECSService.getInstance().selectMapEntity(id);
};

// setMapContainer empties the mapContainer and adds fresh mapDiv to it.
const setMapContainer = (mapDiv: HTMLDivElement) => {
  mapContainer.innerHTML = '';
  van.add(mapContainer, mapDiv);
  editedId.val = getSelectedMap()?.id;
};

// Sort of ugly to run this whenever the module file is loaded.
EventBus.getInstance().register(EventTypes.MapUpdated, setMapContainer);
