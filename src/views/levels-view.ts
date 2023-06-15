// View about the different levels which we do not yet have.
import van from '../van-0.11.10.min';

import { TopNav } from './components/top-nav';

import { getSelectedLevel } from '../services/ecs-service/helpers';
import { LevelService } from '../services/level-service';
import { UiService } from '../services/ui-service';
import { EventTypes, Level } from '../../common';
import { LogService } from '../services/log-service';
import { PlayerService } from '../services/player-service';
import { ECSService } from '../services/ecs-service';
import { AnimalService } from '../services/animal-service';
import { EventBus } from '../event-bus';
const { div, select, option, label, button, input } = van.tags;
let editedLevel: Level | null = null;
let levelContainer = div();

export const LevelsView = (levelDiv: HTMLDivElement) => {
  editedLevel = getSelectedLevel();
  levelContainer = div({ class: 'level-container' }, levelDiv);
  return div({ className: 'levels-view' }, [
    TopNav(),
    div([
      label({ for: 'levelSelect' }, 'Select level: '),
      select(
        {
          name: 'levelSelect',
          onchange: (e: any) => {
            selectLevel(e.target.value);
          },
          value: editedLevel?.id || 'jaska',
        },
        [
          ECSService.getInstance()
            .getAllLevels()
            .map((m) => option({ value: m.id || '' }, m.name || '')),
        ]
      ),
      button(
        {
          onclick: () => {
            LevelService.getInstance().requestLevels();
            UiService.getInstance().refresh();
          },
        },
        'Request levels'
      ),
      button(
        {
          onclick: () => {
            LevelService.getInstance().generateLevel();
          },
        },
        'Generate level'
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
        value: editedLevel && editedLevel.name ? editedLevel.name : 'not selected',
        oninput: (e: any) => {
          if (!editedLevel) return;
          editedLevel.name = e.target.value;
        },
      }),
      label('id: ' + editedLevel?.id),
      button({ onclick: saveLevel }, 'Save level'),
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
    levelContainer,
  ]);
};

const saveLevel = () => {
  if (!editedLevel) return;
  LogService.getInstance().addLogItem('levels-view saveLevel', editedLevel);
  LevelService.getInstance().saveLevel(editedLevel);
};
// Call the ECS to select a level with the given id.
const selectLevel = (id: string) => {
  ECSService.getInstance().selectLevelEntity(id);
};

// setLevelContainer empties the levelContainer and adds fresh levelDiv to it.
const setLevelContainer = (levelDiv: HTMLDivElement) => {
  levelContainer.innerHTML = '';
  van.add(levelContainer, levelDiv);
  editedLevel = getSelectedLevel();
  UiService.getInstance().refresh();
};

// Sort of ugly to run this whenever the module file is loaded.
EventBus.getInstance().register(EventTypes.LevelUpdated, setLevelContainer);
