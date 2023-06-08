import './style.css';

import './ecs';
import { ECSListen } from './ecs';
import { UiService } from './services/ui-service';
import { LogService } from './services/log-service';

LogService.getInstance().addLogItem('[main] App starting...');
// Refresh, ie. render the view.
UiService.getInstance().refresh('main.ts');
ECSListen(true);
