import van from '../../van-0.11.10.min';
import { getSelectedUiObj } from '../../services/ecs-service/helpers';

const { div, span, label } = van.tags;

export const SelectedObj = () => {
  const uiObj = getSelectedUiObj();
  if (!uiObj) return div('no seletion');
  return div({ class: 'selected-obj' }, [
    div({ class: 'flex' }, [div({ class: 'char' }, uiObj?.ui.char || ''), div({ class: 'flex-col' }, [div({ class: 'flex' }, [label('id'), span(uiObj.id)])])]),
  ]);
};
