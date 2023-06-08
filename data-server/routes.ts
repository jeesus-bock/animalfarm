import { Request, Response, Express } from 'express';
import { DataSource } from 'typeorm';
import { DBMap } from './entity/map.entity';
import { dbmapToMap, mapToDBMap } from './transform';
import { genMap } from '../common';
import { uuid } from 'short-uuid';

export const initRoutes = (app: Express, dataSource: DataSource) => {
  app.get('/maps', async (req: Request, res: Response) => {
    const maps = await dataSource.getRepository(DBMap).find();
    return res.json(maps.map((m) => dbmapToMap(m)));
  });
  // For testing purposes for now
  app.get('/maps/generate', async (req: Request, res: Response) => {
    console.log('[end-point] /maps/generate');
    const map = genMap();
    console.log(JSON.stringify(map));
    return res.json(map);
  });
  app.get('/maps/:id', async (req: Request, res: Response) => {
    console.log('[end-point] /maps/' + req.params.id);

    const dbmap = await dataSource.getRepository(DBMap).findOneBy({
      id: req.params.id,
    });
    if (!dbmap) {
      res.status(404);
    }
    return res.json(dbmapToMap(dbmap));
  });
  app.post('/maps', async (req: Request, res: Response) => {
    const tmpMap = mapToDBMap(req.body);
    tmpMap.id = uuid();
    const map = await dataSource.getRepository(DBMap).create(tmpMap);
    const results = await dataSource.getRepository(DBMap).save(map);
    return res.send(dbmapToMap(results));
  });
  app.put('/maps/:id', async (req: Request, res: Response) => {
    const map = await dataSource.getRepository(DBMap).findOneBy({
      id: req.params.id,
    });
    if (!map) {
      res.status(400);
      return res.send('DBMap with id ' + req.params.id + ' not found from database');
    }
    dataSource.getRepository(DBMap).merge(map, mapToDBMap(req.body));
    const results = await dataSource.getRepository(DBMap).save(map);
    return res.json(results);
  });
  app.delete('/maps/:id', async (req: Request, res: Response) => {
    const results = await dataSource.getRepository(DBMap).delete(req.params.id);
    return res.send(results);
  });
  console.log(getRoutes(app));
};

// WIP func to list all endpoints. Might later on be used in server<->server communication.
const getRoutes = (app: Express) => {
  console.log(
    app._router.stack.map((l: any) => {
      if (!l || !l.route) return '';
      return l.route.path + ' ' + Object.keys(l.route.methods);
    })
  );
};
