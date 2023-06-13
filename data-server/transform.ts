import { Level } from '../common';
import { DBLevel } from './entity/level.entity';

export const levelToDBLevel = (level: Level) => {
  const dbLevel: DBLevel = { id: level.id, name: level.name, width: level.dimensions.x, height: level.dimensions.y, matrix: matrixToString(level.matrix) };
  return dbLevel;
};

export const dblevelToLevel = (dblevel: DBLevel) => {
  const level: Level = { id: dblevel.id, isLevel: true, name: dblevel.name, dimensions: { x: dblevel.width, y: dblevel.height }, matrix: stringToMatrix(dblevel.matrix) };
  return level;
};
const matrixToString = (matrix: number[][]): string => {
  let ret = '';
  for (const row of matrix) {
    for (const cell of row) {
      ret += cell + ',';
    }
    ret += ';';
  }
  return ret;
};

const stringToMatrix = (str: string): number[][] => {
  let ret: number[][] = [];
  const rows = str.split(';');
  for (const [i, row] of rows.entries()) {
    const cells = row.split(',').map((c) => parseInt(c));
    ret[i] = cells;
  }
  return ret;
};
