import van from '../../van-0.11.10.min';
import { getSelectedLevel } from '../../services/ecs-service/helpers';
const { div, span, label } = van.tags;
export const SelectedObj = () => {
  const map = getSelectedLevel();
  if (!map) return div('no seletion');
  return div({ class: 'select-ground-type' }, []);
};
