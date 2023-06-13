import { AI, Animal, Species } from '../common';

const inanimateObjs = [
  { char: '🌲', name: 'tree' },
  { char: '🏠', name: 'house' },
  { char: '🚽', name: 'toilet' },
  { char: '👶', name: 'baby' },
  { char: '💲', name: 'money' },
  { char: '☎', name: 'telephone' },
  { char: '🌵', name: 'cactus' },
  { char: '☁', name: 'pile' },
  { char: '⛺', name: 'pyramid' },
  { char: '💬', name: 'message' },
  { char: '💊', name: 'pill' },
];
const animals: Array<Animal> = [
  {
    id: 'george_penguin',
    ui: { char: Species.penguin, color: 'orange' },
    name: 'George',
    stats: { att: 5, def: 3 },
    health: { hp: 20, maxHp: 20 },
    ai: AI.Still,
  },
  {
    id: 'alabama_rider',
    ui: { char: Species.rider, color: 'white' },
    name: 'Alabama',
    stats: { att: 15, def: 10 },
    health: { hp: 30, maxHp: 30 },
    ai: AI.Still,
  },
];
