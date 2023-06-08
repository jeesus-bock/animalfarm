import { DataSource } from 'typeorm';
import { DBMap } from './entity/map.entity';

export const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'animalfarm.db',
  entities: [DBMap],
  logging: true,
  synchronize: true,
});
