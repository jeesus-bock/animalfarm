// View with stuff about the different animals or something.
import van from '../van-0.11.10.min';
import { format } from 'date-fns';

import { TopNav } from './components/top-nav';
import { LogItem } from '../../common';
import { LogService } from '../services/log-service';
const { div, ul, li, span, h1 } = van.tags;

let logList = ul();
// Logs view shows a list of local LogItems added with App.addLogItem()
export const LogsView = () => {
  LogService.getInstance().addLogItem('Rendering LogsView');

  logList = ul([
    LogService.getInstance()
      .getLogs()
      .map((i) => getLogItemRow(i)),
  ]);
  return div({ className: 'logs-view' }, [TopNav(), h1('Animalfarm front-end logs:'), logList]);
};

export const addLogItemRow = (item: LogItem): void => {
  van.add(logList, getLogItemRow(item));
  logList.scrollTop = logList.scrollHeight;
};
const getLogItemRow = (i: LogItem) => {
  return li({ class: 'log-item-row' }, [
    div([
      span({ class: 'time' }, format(new Date(i.time), 'cccc d. hh:mm:ss')),
      span({ class: 'msg' }, i.msg),
      i.payload ? span({ class: 'payload' }, JSON.stringify(i.payload)) : '',
    ]),
  ]);
};
