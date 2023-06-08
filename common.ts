import { generate as genId } from 'short-uuid';

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

  MapUpdated = 'MAP_UPDATED',
  // Request event that server responds to with a list of all the users currently on the server.
  RequestUsers = 'REQUEST_USERS',
  RequestMap = 'REQUEST_MAP',
  RequestAnimal = 'REQUEST_ANIMAL',

  // dispatched after a map has been added to ECS
  MapAdded = 'MAP_ADDED',

  // Send map to server to be saved
  CreateMap = 'CREATE_MAP',

  // Send updated map to server
  UpdateMap = 'UPDATE_MAP',

  // Reply message when user tries to connect with an existing username
  NameInUse = 'NAME_IN_USE',
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

export interface Map {
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
}

// These data models go on top of entities in the ECS.
// If typeorm is added it's entity modeling will spice things up further.
export interface Animal {
  id: string;
  name: string;
  stats: { att: number; def: number };
  health: { hp: number; maxHp: number };
  ui: { char: string; color: string };
  ai: AI;
}

export interface Map {
  id: string;
  name: string;
  selected?: boolean;
  dimensions: { x: number; y: number };
  isMap?: boolean;
  matrix: Array<Array<number>>;
}

export interface UiObj {
  id: string;
  position: { x: number; y: number };
  map: string;
  ui: { char: string; color: string };
  selected?: boolean;
  velocity?: { x: number; y: number };
  ai?: AI;
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
      } else if (Math.round(Math.random() * 10) == 0) {
        ret[y][x] = Math.round(Math.random() * 2);
      } else {
        ret[y][x] = Math.round(Math.random() * 3) + 2;
      }
    }
  }
  return ret;
};
export const genMap = (): Map => {
  const width = Math.round(Math.random() * 20 + 5);
  const height = Math.round(Math.random() * 20 + 5);
  return {
    id: '',
    isMap: true,
    name: genId(),
    dimensions: { x: width, y: height },
    matrix: genMatrix(width, height),
  };
};

const randomGlyph = () => {
  var emojis = [
    '😄',
    '😃',
    '😀',
    '😊',
    '☺',
    '😉',
    '😍',
    '😘',
    '😚',
    '😗',
    '😙',
    '😜',
    '😝',
    '😛',
    '😳',
    '😁',
    '😔',
    '😌',
    '😒',
    '😞',
    '😣',
    '😢',
    '😂',
    '😭',
    '😪',
    '😥',
    '😰',
    '😅',
    '😓',
    '😩',
    '😫',
    '😨',
    '😱',
    '😠',
    '😡',
    '😤',
    '😖',
    '😆',
    '😋',
    '😷',
    '😎',
    '😴',
    '😵',
    '😲',
    '😟',
    '😦',
    '😧',
    '😈',
    '👿',
    '😮',
    '😬',
    '😐',
    '😕',
    '😯',
    '😶',
    '😇',
    '😏',
    '😑',
    '👲',
    '👳',
    '👮',
    '👷',
    '💂',
    '👶',
    '👦',
    '👧',
    '👨',
    '👩',
    '👴',
    '👵',
    '👱',
    '👼',
    '👸',
    '😺',
    '😸',
    '😻',
    '😽',
    '😼',
    '🙀',
    '😿',
    '😹',
    '😾',
    '👹',
    '👺',
    '🙈',
    '🙉',
    '🙊',
    '💀',
    '👽',
    '💩',
    '🔥',
    '✨',
    '🌟',
    '💫',
    '💥',
    '💢',
    '💦',
    '💧',
    '💤',
    '💨',
    '👂',
    '👀',
    '👃',
    '👅',
    '👄',
    '👍',
    '👎',
    '👌',
    '👊',
    '✊',
    '✌',
    '👋',
    '✋',
    '👐',
    '👆',
    '👇',
    '👉',
    '👈',
    '🙌',
    '🙏',
    '☝',
    '👏',
    '💪',
    '🚶',
    '🏃',
    '💃',
    '👫',
    '👪',
    '👬',
    '👭',
    '💏',
    '💑',
    '👯',
    '🙆',
    '🙅',
    '💁',
    '🙋',
    '💆',
    '💇',
    '💅',
    '👰',
    '🙎',
    '🙍',
    '🙇',
    '🎩',
    '👑',
    '👒',
    '👟',
    '👞',
    '👡',
    '👠',
    '👢',
    '👕',
    '👔',
    '👚',
    '👗',
    '🎽',
    '👖',
    '👘',
    '👙',
    '💼',
    '👜',
    '👝',
    '👛',
    '👓',
    '🎀',
    '🌂',
    '💄',
    '💛',
    '💙',
    '💜',
    '💚',
    '❤',
    '💔',
    '💗',
    '💓',
    '💕',
    '💖',
    '💞',
    '💘',
    '💌',
    '💋',
    '💍',
    '💎',
    '👤',
    '👥',
    '💬',
    '👣',
    '💭',
    '🐶',
    '🐺',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🐸',
    '🐯',
    '🐨',
    '🐻',
    '🐷',
    '🐽',
    '🐮',
    '🐗',
    '🐵',
    '🐒',
    '🐴',
    '🐑',
    '🐘',
    '🐼',
    '🐧',
    '🐦',
    '🐤',
    '🐥',
    '🐣',
    '🐔',
    '🐍',
    '🐢',
    '🐛',
    '🐝',
    '🐜',
    '🐞',
    '🐌',
    '🐙',
    '🐚',
    '🐠',
    '🐟',
    '🐬',
    '🐳',
    '🐋',
    '🐄',
    '🐏',
    '🐀',
    '🐃',
    '🐅',
    '🐇',
    '🐉',
    '🐎',
    '🐐',
    '🐓',
    '🐕',
    '🐖',
    '🐁',
    '🐂',
    '🐲',
    '🐡',
    '🐊',
    '🐫',
    '🐪',
    '🐆',
    '🐈',
    '🐩',
    '🐾',
    '💐',
    '🌸',
    '🌷',
    '🍀',
    '🌹',
    '🌻',
    '🌺',
    '🍁',
    '🍃',
    '🍂',
    '🌿',
    '🌾',
    '🍄',
    '🌵',
    '🌴',
    '🌲',
    '🌳',
    '🌰',
    '🌱',
    '🌼',
    '🌐',
    '🌞',
    '🌝',
    '🌚',
    '🌑',
    '🌒',
    '🌓',
    '🌔',
    '🌕',
    '🌖',
    '🌗',
    '🌘',
    '🌜',
    '🌛',
    '🌙',
    '🌍',
    '🌎',
    '🌏',
    '🌋',
    '🌌',
    '🌠',
    '⭐',
    '☀',
    '⛅',
    '☁',
    '⚡',
    '☔',
    '❄',
    '⛄',
    '🌀',
    '🌁',
    '🌈',
    '🌊',
    '🎍',
    '💝',
    '🎎',
    '🎒',
    '🎓',
    '🎏',
    '🎆',
    '🎇',
    '🎐',
    '🎑',
    '🎃',
    '👻',
    '🎅',
    '🎄',
    '🎁',
    '🎋',
    '🎉',
    '🎊',
    '🎈',
    '🎌',
    '🔮',
    '🎥',
    '📷',
    '📹',
    '📼',
    '💿',
    '📀',
    '💽',
    '💾',
    '💻',
    '📱',
    '☎',
    '📞',
    '📟',
    '📠',
    '📡',
    '📺',
    '📻',
    '🔊',
    '🔉',
    '🔈',
    '🔇',
    '🔔',
    '🔕',
    '📢',
    '📣',
    '⏳',
    '⌛',
    '⏰',
    '⌚',
    '🔓',
    '🔒',
    '🔏',
    '🔐',
    '🔑',
    '🔎',
    '💡',
    '🔦',
    '🔆',
    '🔅',
    '🔌',
    '🔋',
    '🔍',
    '🛁',
    '🛀',
    '🚿',
    '🚽',
    '🔧',
    '🔩',
    '🔨',
    '🚪',
    '🚬',
    '💣',
    '🔫',
    '🔪',
    '💊',
    '💉',
    '💰',
    '💴',
    '💵',
    '💷',
    '💶',
    '💳',
    '💸',
    '📲',
    '📧',
    '📥',
    '📤',
    '✉',
    '📩',
    '📨',
    '📯',
    '📫',
    '📪',
    '📬',
    '📭',
    '📮',
    '📦',
    '📝',
    '📄',
    '📃',
    '📑',
    '📊',
    '📈',
    '📉',
    '📜',
    '📋',
    '📅',
    '📆',
    '📇',
    '📁',
    '📂',
    '✂',
    '📌',
    '📎',
    '✒',
    '✏',
    '📏',
    '📐',
    '📕',
    '📗',
    '📘',
    '📙',
    '📓',
    '📔',
    '📒',
    '📚',
    '📖',
    '🔖',
    '📛',
    '🔬',
    '🔭',
    '📰',
    '🎨',
    '🎬',
    '🎤',
    '🎧',
    '🎼',
    '🎵',
    '🎶',
    '🎹',
    '🎻',
    '🎺',
    '🎷',
    '🎸',
    '👾',
    '🎮',
    '🃏',
    '🎴',
    '🀄',
    '🎲',
    '🎯',
    '🏈',
    '🏀',
    '⚽',
    '⚾',
    '🎾',
    '🎱',
    '🏉',
    '🎳',
    '⛳',
    '🚵',
    '🚴',
    '🏁',
    '🏇',
    '🏆',
    '🎿',
    '🏂',
    '🏊',
    '🏄',
    '🎣',
    '☕',
    '🍵',
    '🍶',
    '🍼',
    '🍺',
    '🍻',
    '🍸',
    '🍹',
    '🍷',
    '🍴',
    '🍕',
    '🍔',
    '🍟',
    '🍗',
    '🍖',
    '🍝',
    '🍛',
    '🍤',
    '🍱',
    '🍣',
    '🍥',
    '🍙',
    '🍘',
    '🍚',
    '🍜',
    '🍲',
    '🍢',
    '🍡',
    '🍳',
    '🍞',
    '🍩',
    '🍮',
    '🍦',
    '🍨',
    '🍧',
    '🎂',
    '🍰',
    '🍪',
    '🍫',
    '🍬',
    '🍭',
    '🍯',
    '🍎',
    '🍏',
    '🍊',
    '🍋',
    '🍒',
    '🍇',
    '🍉',
    '🍓',
    '🍑',
    '🍈',
    '🍌',
    '🍐',
    '🍍',
    '🍠',
    '🍆',
    '🍅',
    '🌽',
    '🏠',
    '🏡',
    '🏫',
    '🏢',
    '🏣',
    '🏥',
    '🏦',
    '🏪',
    '🏩',
    '🏨',
    '💒',
    '⛪',
    '🏬',
    '🏤',
    '🌇',
    '🌆',
    '🏯',
    '🏰',
    '⛺',
    '🏭',
    '🗼',
    '🗾',
    '🗻',
    '🌄',
    '🌅',
    '🌃',
    '🗽',
    '🌉',
    '🎠',
    '🎡',
    '⛲',
    '🎢',
    '🚢',
    '⛵',
    '🚤',
    '🚣',
    '⚓',
    '🚀',
    '✈',
    '💺',
    '🚁',
    '🚂',
    '🚊',
    '🚉',
    '🚞',
    '🚆',
    '🚄',
    '🚅',
    '🚈',
    '🚇',
    '🚝',
    '🚋',
    '🚃',
    '🚎',
    '🚌',
    '🚍',
    '🚙',
    '🚘',
    '🚗',
    '🚕',
    '🚖',
    '🚛',
    '🚚',
    '🚨',
    '🚓',
    '🚔',
    '🚒',
    '🚑',
    '🚐',
    '🚲',
    '🚡',
    '🚟',
    '🚠',
    '🚜',
    '💈',
    '🚏',
    '🎫',
    '🚦',
    '🚥',
    '⚠',
    '🚧',
    '🔰',
    '⛽',
    '🏮',
    '🎰',
    '♨',
    '🗿',
    '🎪',
    '🎭',
    '📍',
    '🚩',
    '⬆',
    '⬇',
    '⬅',
    '➡',
    '🔠',
    '🔡',
    '🔤',
    '↗',
    '↖',
    '↘',
    '↙',
    '↔',
    '↕',
    '🔄',
    '◀',
    '▶',
    '🔼',
    '🔽',
    '↩',
    '↪',
    'ℹ',
    '⏪',
    '⏩',
    '⏫',
    '⏬',
    '⤵',
    '⤴',
    '🆗',
    '🔀',
    '🔁',
    '🔂',
    '🆕',
    '🆙',
    '🆒',
    '🆓',
    '🆖',
    '📶',
    '🎦',
    '🈁',
    '🈯',
    '🈳',
    '🈵',
    '🈴',
    '🈲',
    '🉐',
    '🈹',
    '🈺',
    '🈶',
    '🈚',
    '🚻',
    '🚹',
    '🚺',
    '🚼',
    '🚾',
    '🚰',
    '🚮',
    '🅿',
    '♿',
    '🚭',
    '🈷',
    '🈸',
    '🈂',
    'Ⓜ',
    '🛂',
    '🛄',
    '🛅',
    '🛃',
    '🉑',
    '㊙',
    '㊗',
    '🆑',
    '🆘',
    '🆔',
    '🚫',
    '🔞',
    '📵',
    '🚯',
    '🚱',
    '🚳',
    '🚷',
    '🚸',
    '⛔',
    '✳',
    '❇',
    '❎',
    '✅',
    '✴',
    '💟',
    '🆚',
    '📳',
    '📴',
    '🅰',
    '🅱',
    '🆎',
    '🅾',
    '💠',
    '➿',
    '♻',
    '♈',
    '♉',
    '♊',
    '♋',
    '♌',
    '♍',
    '♎',
    '♏',
    '♐',
    '♑',
    '♒',
    '♓',
    '⛎',
    '🔯',
    '🏧',
    '💹',
    '💲',
    '💱',
    '©',
    '®',
    '™',
    '〽',
    '〰',
    '🔝',
    '🔚',
    '🔙',
    '🔛',
    '🔜',
    '❌',
    '⭕',
    '❗',
    '❓',
    '❕',
    '❔',
    '🔃',
    '🕛',
    '🕧',
    '🕐',
    '🕜',
    '🕑',
    '🕝',
    '🕒',
    '🕞',
    '🕓',
    '🕟',
    '🕔',
    '🕠',
    '🕕',
    '🕖',
    '🕗',
    '🕘',
    '🕙',
    '🕚',
    '🕡',
    '🕢',
    '🕣',
    '🕤',
    '🕥',
    '🕦',
    '✖',
    '➕',
    '➖',
    '➗',
    '♠',
    '♥',
    '♣',
    '♦',
    '💮',
    '💯',
    '✔',
    '☑',
    '🔘',
    '🔗',
    '➰',
    '🔱',
    '🔲',
    '🔳',
    '◼',
    '◻',
    '◾',
    '◽',
    '▪',
    '▫',
    '🔺',
    '⬜',
    '⬛',
    '⚫',
    '⚪',
    '🔴',
    '🔵',
    '🔻',
    '🔶',
    '🔷',
    '🔸',
    '🔹',
  ];

  return emojis[Math.floor(Math.random() * emojis.length)];
};

const genLightRGB = (): string => {
  const r = Math.round(Math.random() * 155 + 100);
  const g = Math.round(Math.random() * 155 + 100);
  const b = Math.round(Math.random() * 155 + 100);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

export const GenUiObj = (mapWidth: number, mapHeight: number, mapName: string): UiObj => {
  const ret: UiObj = {
    id: genId(),
    position: { x: Math.round(Math.random() * (mapWidth - 1)) + 1, y: Math.round(Math.random() * (mapHeight - 1)) + 1 },
    map: mapName,
    velocity: { x: 0, y: 0 },
    ui: { char: randomGlyph(), color: genLightRGB() },
    ai: AI.RndDir,
  };
  return ret;
};