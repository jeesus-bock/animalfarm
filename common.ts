import { generate as genId } from 'short-uuid';

import { testNames, testEmojis } from './test-data';
// Datatypes, constants and other code that can be shared between the front and the backend.

// Microservice ports, host is always localhost at the moment
export const DATA_SERVER_PORT = 8082;
export const SOCKET_SERVER_PORT = 8081;

export const FRONT_END_PORT = 5173;

export enum EventTypes {
  // The simpilistic ticker that lets backend schedule the frontend ECS updates.
  Tick = 'TICK',

  // User enters the server
  Enter = 'ENTER',
  // User exits the server
  Exit = 'EXIT',

  LevelUpdated = 'LEVEL_UPDATED',
  // Request event that server responds to with a list of all the users currently on the server.
  RequestUsers = 'REQUEST_USERS',
  RequestLevels = 'REQUEST_LEVELS',
  GenerateLevel = 'GENERATE_LEVEL',
  RequestAnimal = 'REQUEST_ANIMAL',

  // dispatched after a level has been added to ECS
  LevelAdded = 'LEVEL_ADDED',

  // Send level to server to be saved
  CreateLevel = 'CREATE_LEVEL',

  // Send updated level to server
  UpdateLevel = 'UPDATE_LEVEL',

  // Reply message when user tries to connect with an existing username
  NameInUse = 'NAME_IN_USE',

  // bound to document.body.onkeydown
  KeyDown = 'KEY_DOWN',

  GroundTypeSelected = 'GROUND_TYPE_SELECTED',
}

export interface User {
  id: string;
  name: string;
  connected: number;
}
export interface LogItem {
  // Might aswell use unix timestamps :)
  time: number;
  msg: string;
  payload?: object;
  // Only the server-side logs need to be separated by user, so make it optional.
  user?: User;
}

export interface Level {
  id: string;
  name: string;
  dimensions: { x: number; y: number };
  matrix: number[][];
}

// Different AIs. Put it here in commons.ts because Animal interface needs it
// and importing from sub-dirs doesn't sound good.
// At the moment it's only relevant in the ECS, but it's possible the
// Server will do something with it eventually.
export enum AI {
  // Moves the animal in random directions.
  RndDir = 'RANDOM_DIRECTION',
  Still = 'STILL',
  Player = 'PLAYER',
}

export enum Species {
  penguin = '🐧',
  rider = '🏇',
  monkey = '🙉',
  bee = '🐝',
  snake = '🐍',
  tracktor = '🚜',
  ghost = '👻',
  camel = '🐫',
  dromedar = '🐪',
  goat = '🐐',
  carouselHorse = '🎠',
  twins = '👯',
  pig = '🐷',
  chicken = '🐓',
  chick = '🐤',
  devil = '😈',
  woman = '🚺',
  man = '🚹',
  bigNose = '👺',
  panda = '🐼',
  vortex = '🌀',
}

export interface Stats {
  att: number;
  def: number;
}
export interface Health {
  hp: number;
  maxHp: number;
}

// These data models go on top of entities in the ECS.
// If typeorm is added it's entity modeling will spice things up further.
export interface UiObj {
  id: string;
  position: { x: number; y: number };
  levelId: string;
  ui: { char: string; color: string };
  selected?: boolean;
  velocity?: XY;
}

export interface XY {
  x: number;
  y: number;
}
export interface Animal {
  id: string;
  name: string;
  stats: Stats;
  health: { hp: number; maxHp: number };
  ui: { char: string; color: string };
  ai: AI;
}

export interface UiAnimal extends Animal, UiObj {}
export interface Player extends UiAnimal {
  isPlayer: boolean;
}
export interface Level {
  id: string;
  name: string;
  selected?: boolean;
  dimensions: XY;
  isLevel?: boolean;
  matrix: Array<Array<number>>;
}

export const genMatrix = (width: number, height: number) => {
  const ret: Array<Array<number>> = [];

  // Generate the matrix with oldskool loops.
  for (let y = 0; y < height; y++) {
    ret[y] = [];
    for (let x = 0; x < width; x++) {
      // 0 and 1 are impassable
      if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
        ret[y][x] = 0;
      } else if (Math.round(Math.random() * 5) == 0) {
        if (ret[y][x - 1] == 0 || ret[y - 1][x] == 0) {
          ret[y][x] = 0;
          continue;
        } else if (ret[y - 1][x] == 1 || ret[y][x - 1] == 1) {
          ret[y][x] = 1;
          continue;
        }
        ret[y][x] = Math.round(Math.random() * 2);
      } else {
        ret[y][x] = Math.round(Math.random() * 3) + 2;
      }
    }
  }
  return ret;
};
export const genLevel = (): Level => {
  const width = Math.round(Math.random() * 10 + 20);
  const height = Math.round(Math.random() * 10 + 20);
  return {
    id: '',
    isLevel: true,
    name: genId(),
    dimensions: { x: width, y: height },
    matrix: genMatrix(width, height),
  };
};

////////////7
// Generator functions that output random animals or player
// Camel-cased functions are module private, and the snake-cased
// ones are exportd to public use
//
// The functions are here atm because i'm thinking of doing
// the generation on the backend
const randomGlyph = () => {
  return testEmojis[Math.floor(Math.random() * testEmojis.length)];
};
const genName = () => {
  return testNames[Math.floor(Math.random() * testNames.length)];
};
const genSpecies = (): Species => {
  return Species.penguin;
};
const genHealth = (): Health => {
  const hp = Math.round(Math.random() * 10) + 5;
  return { hp: hp, maxHp: hp };
};
const genStats = (): Stats => {
  return { att: Math.round(Math.random() * 10) + 5, def: Math.round(Math.random() * 10) + 3 };
};
const genLightRGB = (): string => {
  const r = Math.round(Math.random() * 155 + 100);
  const g = Math.round(Math.random() * 155 + 100);
  const b = Math.round(Math.random() * 155 + 100);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

const genUiObj = (levelWidth: number, levelHeight: number, levelId: string): UiObj => {
  const ret: UiObj = {
    id: genId(),
    position: { x: Math.round(Math.random() * (levelWidth - 2)) + 1, y: Math.round(Math.random() * (levelHeight - 2)) + 1 },
    levelId: levelId,
    ui: { char: randomGlyph(), color: genLightRGB() },
  };
  return ret;
};

const genUiAnimal = (base: UiObj): UiAnimal => {
  return { name: genName(), health: genHealth(), stats: genStats(), ai: AI.RndDir, ...base };
};

const genPlayer = (base: UiAnimal): Player => {
  return { isPlayer: true, ...base };
};

export const GenUiAnimal = (levelWidth: number, levelHeight: number, levelId: string): UiAnimal => {
  const uiObj = genUiObj(levelWidth, levelHeight, levelId);
  return { ...genUiAnimal(uiObj), velocity: { x: 0, y: 0 } };
};
export const GenPlayer = (levelWidth: number, levelHeight: number, levelId: string): Player => {
  const uiObj = genUiObj(levelWidth, levelHeight, levelId);
  const uiAnimalObj = genUiAnimal(uiObj);
  return { ...genPlayer(uiAnimalObj), ai: AI.Player };
};
