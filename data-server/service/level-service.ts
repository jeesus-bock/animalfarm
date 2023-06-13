import { Level } from '../../common';
import { DataSource } from 'typeorm';
import { DBLevel } from '../entity/level.entity';
import { dblevelToLevel, levelToDBLevel } from '../transform';
import { genLevel } from '../../common';
import { uuid } from 'short-uuid';
import { dataSource } from '../data-source';

export interface LevelServiceI {
  // returns all the levels in the db,
  getLevels: () => Promise<Array<Level>>;
  getLevel: (levelId: string) => Promise<Level | null>;
  createLevel: (level: Level) => Promise<Level>;
  // updateLevel doesn't really require levelId as it is part of the level object o_O
  updateLevel: (levelId: string, level: Level) => Promise<Level | null>;
}

export class LevelService implements LevelServiceI {
  private static instance?: LevelService = undefined;
  public static getInstance(): LevelService {
    if (!this.instance) {
      this.instance = new LevelService();
    }
    return this.instance;
  }
  constructor() {}
  getLevels = async (): Promise<Array<Level>> => {
    const levels = await dataSource.getRepository(DBLevel).find();
    console.log('öööööö', levels);
    return levels.map((m) => dblevelToLevel(m));
  };
  getLevel = async (levelId: string): Promise<Level | null> => {
    const dblevel = await dataSource.getRepository(DBLevel).findOneBy({
      id: levelId,
    });
    if (!dblevel) return null;
    return dblevelToLevel(dblevel);
  };
  createLevel = async (reqLevel: Level): Promise<Level> => {
    const tmpLevel = levelToDBLevel(reqLevel);
    tmpLevel.id = uuid();
    const level = await dataSource.getRepository(DBLevel).create(tmpLevel);
    const results = await dataSource.getRepository(DBLevel).save(level);
    return dblevelToLevel(results);
  };
  updateLevel = async (levelId: string, reqLevel: Level): Promise<Level | null> => {
    const level = await dataSource.getRepository(DBLevel).findOneBy({
      id: levelId,
    });
    if (!level) {
      return null;
    }
    dataSource.getRepository(DBLevel).merge(level, levelToDBLevel(reqLevel));
    const results = await dataSource.getRepository(DBLevel).save(level);
    return dblevelToLevel(results);
  };
}
