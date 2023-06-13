import { DataSource } from 'typeorm';
import { DBLevel } from './entity/level.entity';

export const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'animalfarm.db',
  entities: [DBLevel],
  logging: true,
  synchronize: true,
});
