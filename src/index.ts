import express from 'express';
import cors from 'cors';

import router from './routes';
import DB from './database';

class Server {
  public app: express.Application;
  private PORT = process.env.PORT || '3333';

  constructor() {
    this.app = express();
    this.initConfig();
    this.initRoutes();
    this.initDB();
    this.start();  
  }

  private async initConfig() {
    this.app.use(cors());
    this.app.use(express.json())
  }

  private initRoutes() {
    this.app.use('/api', router);

    this.app.use((req, res) => {
      res.send('Route not found');
    });

    this.app.use((err: any, req: any, res: any, next: any) => {
      if (!next) {
        //handleError(err, res);
      }
      next(err, req, res);
    });
  }

  private start(): any {
    return this.app.listen(this.PORT, () => {
      console.info(`Server listening on : ${this.PORT}`);
    });
  }

  private initDB(): void {
    return DB.connect();
  }
}

export const server = new Server();