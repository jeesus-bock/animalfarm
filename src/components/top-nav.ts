import van from '../van-0.11.10.min';

import { View } from '../views/types';
import { ECSListen } from '../ecs';
import { UiService } from '../services/ui-service';
import { StorageService } from '../services/storage-service';
import { UserService } from '../services/user-service';
const { nav, ul, li, span } = van.tags;

const items = [
  { label: 'Map', view: View.Map },
  { label: 'Animals', view: View.Animals },
  { label: 'Maps', view: View.Maps },
  { label: 'Users', view: View.Users },
  { label: 'Logs', view: View.Logs },
];

const ECSListenOn = van.state(true);

// Top navigation bar.
export const TopNav = () => {
  const user = StorageService.getInstance().getUser();

  // Save the state whethers we are listening to Tick events on the ECS.

  const userStr = user ? user.id + ' - ' + user.name : 'no user';
  return nav({ class: 'top-nav' }, [
    ul(
      items.map((item) =>
        li(
          {
            class: window.location.pathname == item.view ? 'item selected' : 'item',
            onclick: () => {
              // Move to the tab.
              UiService.getInstance().navigateTo(item.view);
            },
          },
          item.label
        )
      )
    ),
    span(
      {
        class: 'pause-tag',
        onclick: () => {
          ECSListen(!ECSListenOn.val);
          ECSListenOn.val = !ECSListenOn.val;
          UiService.getInstance().refresh();
        },
      },
      ECSListenOn.val ? 'Pause' : 'Unpause'
    ),
    span(
      {
        class: 'user-tag',
        onclick: UserService.getInstance().logout,
      },
      userStr
    ),
  ]);
};
