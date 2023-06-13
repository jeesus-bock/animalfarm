import { Map } from '../../common';
import { DataSource } from 'typeorm';
import { DBMap } from '../entity/map.entity';
import { dbmapToMap, mapToDBMap } from '../transform';
import { genMap } from '../../common';
import { uuid } from 'short-uuid';
import { dataSource } from '../data-source';

export interface MapServiceI {
  // returns all the maps in the db,
  getMaps: () => Promise<Array<Map>>;
  getMap: (mapId: string) => Promise<Map | null>;
  createMap: (map: Map) => Promise<Map>;
  // updateMap doesn't really require mapId as it is part of the map object o_O
  updateMap: (mapId: string, map: Map) => Promise<Map | null>;
}

export class MapService implements MapServiceI {
  private static instance?: MapService = undefined;
  public static getInstance(): MapService {
    if (!this.instance) {
      this.instance = new MapService();
    }
    return this.instance;
  }
  constructor() {}
  getMaps = async (): Promise<Array<Map>> => {
    const maps = await dataSource.getRepository(DBMap).find();
    return maps.map((m) => dbmapToMap(m));
  };
  getMap = async (mapId: string): Promise<Map | null> => {
    const dbmap = await dataSource.getRepository(DBMap).findOneBy({
      id: mapId,
    });
    if (!dbmap) return null;
    return dbmapToMap(dbmap);
  };
  createMap = async (reqMap: Map): Promise<Map> => {
    const tmpMap = mapToDBMap(reqMap);
    tmpMap.id = uuid();
    const map = await dataSource.getRepository(DBMap).create(tmpMap);
    const results = await dataSource.getRepository(DBMap).save(map);
    return dbmapToMap(results);
  };
  updateMap = async (mapId: string, reqMap: Map): Promise<Map | null> => {
    const map = await dataSource.getRepository(DBMap).findOneBy({
      id: mapId,
    });
    if (!map) {
      return null;
    }
    dataSource.getRepository(DBMap).merge(map, mapToDBMap(reqMap));
    const results = await dataSource.getRepository(DBMap).save(map);
    return dbmapToMap(results);
  };
}
