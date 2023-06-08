import express from 'express';
import { initRoutes } from './routes';
import { dataSource } from './data-source';
import { DATA_SERVER_PORT } from '../common';
const app = express();
dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.use(express.json());
initRoutes(app, dataSource);
console.log('Running data server on port ' + DATA_SERVER_PORT);
app.listen(DATA_SERVER_PORT);
