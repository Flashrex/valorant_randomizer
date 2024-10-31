import { MysqlError } from 'mysql';
import Database from '../database/index';
import Logger from '../misc/logger';
import { Map } from '../types/Map';

function getAll(): Promise<Map[]> {
    return new Promise((resolve, reject) => {
        Database.instance.query('SELECT * FROM maps' , async (err: MysqlError | null, results: any) => {
            if (err) {
                Logger.error('maps', `Error fetching maps: ${err}`);
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

function create(map: Map): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Database.instance.query('INSERT INTO maps SET ?', map, (err: MysqlError | null) => {
            if (err) {
                Logger.error('maps', `Error creating map: ${err}`);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function update(map: Map): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Database.instance.query('UPDATE maps SET ? WHERE id = ?', [map, map.id], (err: MysqlError | null) => {
            if (err) {
                Logger.error('maps', `Error updating map: ${err}`);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

export default {
    getAll,
    create,
    update,
}