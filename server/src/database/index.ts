import mysql from 'mysql';
import Logger from '../misc/logger';
import ENV from '../misc/environment';
import createTables from './model';

export default class Database {

    private static _instance: Database;
    private connection?: mysql.Connection;
    private config: mysql.ConnectionConfig;

    constructor() {

        this.config = {
            host: ENV.DATABASE_HOST,
            port: ENV.DATABASE_PORT ? parseInt(ENV.DATABASE_PORT) : 4406,
            user: ENV.DATABASE_USER,
            password: ENV.DATABASE_PASSWORD,
            database: ENV.DATABASE_NAME,
        };

        this.createConnection();
    }

    public static get instance() : Database {
        return this._instance || (this._instance = new this());
    }

    public get isConnected() : boolean {
        return this.connection?.state === 'authenticated';
    }

    private createConnection() {
        this.connection = mysql.createConnection(this.config);

        this.connection.on('error', (err) => {
            Logger.error('database', `Database connection error: ${err}`);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                this.handleDisconnect();
            } else {
                throw err;
            }
        });
    }

    connect(attempts = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection?.connect((err) => {
                if (err) {
                    if (attempts < 3) {
                        Logger.log('database', 'Retrying connection...');
                        setTimeout(() => this.connect(attempts + 1).then(resolve).catch(reject), 2000);
                    } else {
                        Logger.error('database', `Error connecting to database: ${err}`);
                        reject(err);
                    }
                } else {
                    Logger.log('database', `Connected to database [\x1b[34m${ENV.DATABASE_HOST}:${ENV.DATABASE_PORT}\x1b[0m]`);
                    resolve();
                }
            });
        });
    }

    async checkTables() {
        await createTables();
    }

    query(sql: string, values: any, callback?: (err: mysql.MysqlError | null, results?: any, fields?: mysql.FieldInfo[]) => void) {
        if(!this.isConnected) return;
        this.connection?.query(sql, values, callback);
    }

    get state() {
        return this.connection?.state;
    }

    private handleDisconnect() {
        Logger.log('database', 'Attempting to reconnect to the database...');
        const attemptReconnect = () => {
            this.createConnection();
            this.connect().catch((error) => {
                Logger.error('database', 'Failed to reconnect to database, retrying...');
                setTimeout(attemptReconnect, 5000);
            });
        };
        attemptReconnect();
    }
}