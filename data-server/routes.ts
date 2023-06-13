import { Request, Response, Express } from 'express';
import { LevelService } from './service/level-service';
import { genLevel } from '../common';

export const initRoutes = (app: Express) => {
  app.get('/levels', async (req: Request, res: Response) => {
    res.json(await LevelService.getInstance().getLevels());
  });
  // For testing purposes for now
  app.get('/levels/generate', async (req: Request, res: Response) => {
    console.log('[end-point] /levels/generate');
    const level = genLevel();
    console.log(JSON.stringify(level));
    return res.json(level);
  });
  app.get('/levels/:id', async (req: Request, res: Response) => {
    console.log('[end-point] /levels/' + req.params.id);
    const level = LevelService.getInstance().getLevel(req.params.id);
    if (!level) return res.status(404);
    return res.json(level);
  });
  app.post('/levels', async (req: Request, res: Response) => {
    console.log('[end-point] /levels POST');
    const level = LevelService.getInstance().getLevel(req.params.id);
    if (!level) return res.status(404);
    return res.json(level);
  });
  app.put('/levels/:id', async (req: Request, res: Response) => {
    console.log('[end-point] /levels/' + req.params.id + ' POST');
    const level = LevelService.getInstance().updateLevel(req.params.id, req.body);
    if (!level) return res.status(404);
    return res.json(level);
  });
};

// WIP func to list all endpoints. Might later on be used in server<->server communication.
const getRoutes = (app: Express) => {
  console.log(
    app._router.stack.level((l: any) => {
      if (!l || !l.route) return '';
      return l.route.path + ' ' + Object.keys(l.route.methods);
    })
  );
};
