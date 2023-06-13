// View with the level
import van from '../van-0.11.10.min';

import { TopNav } from './components/top-nav';
import { LogService } from '../services/log-service';
import { SelectedObj } from './components/seleted-obj';
import { EventBus } from '../event-bus';
import { EventTypes } from '../../common';
const { div } = van.tags;
let levelContainer = div();

export const LevelView = (levelDiv: HTMLDivElement) => {
  LogService.getInstance().addLogItem('Rendering LevelView');
  levelContainer = div({ class: 'level-container' }, levelDiv);
  return div({ className: 'level-view' }, [TopNav(), div({ class: 'content' }, levelContainer), SelectedObj()]);
};

// setLevelContainer empties the levelContainer and adds fresh levelDiv to it.
const setLevelContainer = (levelDiv: HTMLDivElement) => {
  LogService.getInstance().addLogItem('LevelView setLevelContainer', levelDiv.innerHTML.length);
  //levelContainer.innerHTML = '';
  van.add(levelContainer, levelDiv);
};

// Sort of ugly to run this whenever the module file is loaded.
EventBus.getInstance().register(EventTypes.LevelUpdated, setLevelContainer);
