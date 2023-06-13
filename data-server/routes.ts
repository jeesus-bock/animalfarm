import { Request, Response, Express } from 'express';
import { MapService } from './service/map-service';
import { genMap } from '../common';

export const initRoutes = (app: Express) => {
  app.get('/maps', async (req: Request, res: Response) => {
    res.json(await MapService.getInstance().getMaps());
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
    const map = MapService.getInstance().getMap(req.params.id);
    if (!map) return res.status(404);
    return res.json(map);
  });
  app.post('/maps', async (req: Request, res: Response) => {
    console.log('[end-point] /maps POST');
    const map = MapService.getInstance().getMap(req.params.id);
    if (!map) return res.status(404);
    return res.json(map);
  });
  app.put('/maps/:id', async (req: Request, res: Response) => {
    console.log('[end-point] /maps/' + req.params.id + ' POST');
    const map = MapService.getInstance().updateMap(req.params.id, req.body);
    if (!map) return res.status(404);
    return res.json(map);
  });
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
