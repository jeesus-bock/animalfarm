import { AI, Animal, Species } from '../common';

const inanimateObjs = [
  {
    char: '🌲',
    name: 'tree',
  },
  {
    char: '🏠',
    name: 'house',
  },
];
const animals: Array<Animal> = [
  {
    id: 'george_penguin',
    ui: { char: '🐧', color: 'orange' },
    name: 'George',
    species: Species.penguin,
    stats: { att: 5, def: 3 },
    health: { hp: 20, maxHp: 20 },
    ai: AI.Still,
  },
  {
    id: 'alabama_rider',
    ui: { char: '🏇', color: 'white' },
    name: 'Alabama',
    species: Species.rider,
    stats: { att: 15, def: 10 },
    health: { hp: 30, maxHp: 30 },
    ai: AI.Still,
  },
];
