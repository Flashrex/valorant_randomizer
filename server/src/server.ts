import express from "express";
import cors from 'cors';
import csurf from 'csurf';
import Logger from './misc/logger';
import ENV from './misc/environment';

import mapsRouter from './maps/index';
import { NotImplementedError } from "./errors/NotImplementedError";


export default class Server {

    private static _instance: Server;

    private port: number = 3000;
    private app?: express.Application;

    private started: boolean = false;

    private constructor() {
        this.port = parseInt(ENV.APP_PORT || '3000');
    }

    public static get instance() : Server {
        return this._instance || (this._instance = new this());
    }

    start() {
        if(this.started) return;

        this.app = express();

        this.app.use(cors({
            origin: 'http://localhost'
        }));

        this.app.use(csurf());

        this.app.use((req, res, next) => {
            Logger.log('app', `Request received: ${req.method} ${req.url}`);
            next();
        });

        this.app.use("/api/maps", mapsRouter);

        this.app.listen(this.port, () => {
            Logger.log('app', `Server started at [\x1b[34mhttp://localhost:${this.port}\x1b[0m]`);
            this.started = true;
        });
    }

    stop() {
        throw new NotImplementedError();
    }

    restart() {
        // Restart server
    }
}