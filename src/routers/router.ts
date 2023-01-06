import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { connect_database } from '../models/mongo';
import user from '../services/userService';

export async function init_routers(): Promise<Express> {

    const app: Express = express();
    app.use(bodyParser.json());
    app.use('/', user);

    await connect_database();

    return app;
    
}