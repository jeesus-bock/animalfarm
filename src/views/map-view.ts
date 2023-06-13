// View with the map
import van from '../van-0.11.10.min';

import { TopNav } from './components/top-nav';
import { LogService } from '../services/log-service';
import { SelectedObj } from './components/seleted-obj';
import { EventBus } from '../event-bus';
import { EventTypes } from '../../common';
const { div } = van.tags;
let mapContainer = div();

export const MapView = (mapDiv: HTMLDivElement) => {
  LogService.getInstance().addLogItem('Rendering MapView');
  mapContainer = div({ class: 'map-container' }, mapDiv);
  return div({ className: 'map-view' }, [TopNav(), div({ class: 'content' }, mapContainer), SelectedObj()]);
};

// setMapContainer empties the mapContainer and adds fresh mapDiv to it.
const setMapContainer = (mapDiv: HTMLDivElement) => {
  LogService.getInstance().addLogItem('MapView setMapContainer', mapDiv.innerHTML.length);
  //mapContainer.innerHTML = '';
  van.add(mapContainer, mapDiv);
};

// Sort of ugly to run this whenever the module file is loaded.
EventBus.getInstance().register(EventTypes.MapUpdated, setMapContainer);
