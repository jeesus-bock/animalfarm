import van from '../../van-0.11.10.min';

import { View } from '../types';
import { UiService } from '../../services/ui-service';
import { StorageService } from '../../services/storage-service';
import { UserService } from '../../services/user-service';
const { nav, ul, li, span } = van.tags;

const items = [
  { label: 'Level', view: View.Level },
  { label: 'Animals', view: View.Animals },
  { label: 'Levels', view: View.Levels },
  { label: 'Users', view: View.Users },
  { label: 'Logs', view: View.Logs },
];

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
        class: 'user-tag',
        onclick: UserService.getInstance().logout,
      },
      userStr
    ),
  ]);
};
