import './style.css';

import { UiService } from './services/ui-service';
import { LogService } from './services/log-service';
import { EventBus } from './event-bus';
import { EventTypes } from '../common';

LogService.getInstance().addLogItem('[main] App starting...');
// Refresh, ie. render the view.
UiService.getInstance().refresh('main.ts');
document.body.onkeydown = (e) => {
  EventBus.getInstance().dispatch(EventTypes.KeyDown, e.key);
};
