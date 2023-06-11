// View with stuff about the different animals or something.
import van from '../van-0.11.10.min';

import { TopNav } from './components/top-nav';
const { div } = van.tags;

export const AnimalsView = () => {
  return div({ className: 'animals-view' }, [TopNav(), div({ class: 'content' }, ['Animals content missing'])]);
};
