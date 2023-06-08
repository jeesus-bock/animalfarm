import { UserService } from '../services/user-service';
import van from '../van-0.11.10.min';
const { div, input, button } = van.tags;
const name = van.state('');

export const LoginView = () => {
  return div(
    { class: 'login-view' },
    div({ class: 'login-box' }, [
      input({
        style: 'width: 20rem',
        placeholder: 'Enter name',
        oninput: (e: any) => {
          name.val = e.target.value;
        },
      }),
      button(
        {
          onclick: () => {
            UserService.getInstance().login(name.val);
          },
        },
        'Login'
      ),
    ])
  );
};
