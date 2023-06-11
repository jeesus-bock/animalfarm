// View with stuff about the different animals or something.
import van from '../van-0.11.10.min';
import { format } from 'date-fns';

import { TopNav } from './components/top-nav';
import { User } from '../../common';
import { SocketService } from '../services/socket-service';
import { UserService } from '../services/user-service';
const { div, ul, li, label, span } = van.tags;

let timeout: number;
// For now the users view only shows a list of logged in users.
export const UsersView = () => {
  if (!timeout) {
    timeout = window.setTimeout(() => {
      // Send RequestUsers socket message 500ms after being called
      // The RequestUsers response handler runs UiService.refresh() so
      // we get fresh data every half a second.
      SocketService.getInstance().requestUsers();
    }, 5000);
  }
  return div({ className: 'users-view' }, [
    TopNav(),
    ul([
      UserService.getInstance()
        .getUsers()
        .map((u) => getUserBox(u)),
    ]),
  ]);
};

const getUserBox = (u: User) => {
  return li({ class: 'user-box' }, [div([label('Id'), span(u.id)]), div([label('Name'), span(u.name)]), div([label('Connected'), span(format(new Date(u.connected), 'HH:MM'))])]);
};
