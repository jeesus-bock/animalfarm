import { getSelectedUiObj } from '../ecs/helpers';
import van from '../van-0.11.10.min';
const { div, span } = van.tags;
export const SelectedObj = () => {
  const uiObj = getSelectedUiObj();
  if (!uiObj) return div('no seletion');
  return div({ class: 'selected-obj' }, [div({ class: 'flex' }, [div({ class: 'char' }, uiObj?.ui.char || ''), span(uiObj?.id)])]);
};
