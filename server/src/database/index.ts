import mysql from 'mysql';
import Logger from '../misc/logger';
import ENV from '../misc/environment';
import createTables from './model';

export default class Database {

    private static _instance: Database;
    private connection: mysql.Connection;

    constructor() {

        this.connection = mysql.createConnection({
            host: ENV.DATABASE_HOST || 'localhost',
            port: ENV.DATABASE_PORT ? parseInt(ENV.DATABASE_PORT) : 3306,
            user: ENV.DATABASE_USER || 'root',
            password: ENV.DATABASE_PASSWORD || '',
            database: ENV.DATABASE_NAME || 'valomizer',
        });
    }

    public static get instance() : Database {
        return this._instance || (this._instance = new this());
    }

    public get isConnected() : boolean {
        return this.connection.state === 'authenticated';
    }

    connect(attempts = 0): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    if (attempts < 3) {
                        Logger.log('database', 'Retrying connection...');
                        setTimeout(() => this.connect(attempts + 1).then(resolve).catch(reject), 2000);
                    } else {
                        Logger.error('database', `Error connecting to database: ${err}`);
                        reject(err);
                    }
                } else {
                    Logger.log('database', `Connected to database [\x1b[34m${process.env.DB_HOST}:${process.env.DB_PORT}\x1b[0m]`);
                    resolve();
                }
            });
        });
    }

    async checkTables() {
        await createTables();
    }

    query(sql: string, values: any, callback?: (err: mysql.MysqlError | null, results?: any, fields?: mysql.FieldInfo[]) => void) {
        this.connection.query(sql, values, callback);
    }

    get state() {
        return this.connection.state;
    }
}