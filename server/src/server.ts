import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import express from "express";
import cors from 'cors';
import Logger from './misc/logger';
import ENV from './misc/environment';

import mapsRouter from './maps/index';
import { NotImplementedError } from "./errors/NotImplementedError";

const allowedOrigins = [
    `https://valomizer.net`,
    `http://localhost:8081`,
];

export default class Server {

    private static _instance: Server;

    private port: number;
    private app?: express.Application;

    private started: boolean = false;

    private constructor() {
        this.port = parseInt(ENV.APP_PORT || '1337');
    }

    public static get instance() : Server {
        return this._instance || (this._instance = new this());
    }

    start() {
        if(this.started) return;

        this.app = express();

        this.app.use((req, res, next) => {
            const now = new Date().toISOString();
            Logger.log('app', `[${now}] ${req.method} ${req.url}`);
            next();
        });

        const corsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        };

        this.app.use(cors(corsOptions));

        const options = {
            cert: fs.readFileSync('./.ssl/fullchain.pem'),
            key: fs.readFileSync('./.ssl/privkey.pem')
        };

        if(ENV.ENVIRONMENT === 'dev') {
            http.createServer(this.app).listen(this.port, () => {
                Logger.log('app', `HTTP Server listening at port [\x1b[34m${this.port}\x1b[0m]`);
            });
        } else {
            https.createServer(options, this.app).listen(this.port, () => {
                Logger.log('app', `Server listening at port [\x1b[34m${this.port}\x1b[0m]`);
                this.started = true;
            });
        }

        this.app.use("/api/maps", mapsRouter);
    }

    stop() {
        throw new NotImplementedError();
    }

    restart() {
        throw new NotImplementedError();
    }
}