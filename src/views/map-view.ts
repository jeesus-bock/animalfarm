// View with the map
import van from '../van-0.11.10.min';

import { TopNav } from '../components/top-nav';
import { LogService } from '../services/log-service';
import { SelectedObj } from '../components/seleted-obj';
const { div } = van.tags;

export const MapView = (mapDiv: HTMLDivElement) => {
  LogService.getInstance().addLogItem('Rendering MapView');
  return div({ className: 'map-view' }, [TopNav(), div({ class: 'content' }, div({ class: 'map-container' }, mapDiv)), SelectedObj()]);
};
