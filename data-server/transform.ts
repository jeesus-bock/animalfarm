import { Map } from '../common';
import { DBMap } from './entity/map.entity';

export const mapToDBMap = (map: Map) => {
  const dbMap: DBMap = { id: map.id, name: map.name, width: map.dimensions.x, height: map.dimensions.y, matrix: matrixToString(map.matrix) };
  return dbMap;
};

export const dbmapToMap = (dbmap: DBMap) => {
  const map: Map = { id: dbmap.id, isMap: true, name: dbmap.name, dimensions: { x: dbmap.width, y: dbmap.height }, matrix: stringToMatrix(dbmap.matrix) };
  return map;
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
