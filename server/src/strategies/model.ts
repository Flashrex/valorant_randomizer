import { MysqlError } from 'mysql';
import Database from '../database/index';
import Logger from '../misc/logger';
import { Strategy } from '../types/Strategy';

function getAll(): Promise<Strategy[]> {
    return new Promise((resolve, reject) => {
        Database.instance.query('SELECT * FROM strategies' , async (err: MysqlError | null, results: any) => {
            if (err) {
                Logger.error('strategies', `Error fetching strategies: ${err}`);
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

function get(id: number): Promise<Strategy> {
    return new Promise((resolve, reject) => {
        Database.instance.query('SELECT * FROM strategies WHERE id = ?', [id], async (err: MysqlError | null, results: any) => {
            if (err) {
                Logger.error('strategies', `Error fetching strategy: ${err}`);
                reject(err);
                return;
            }
            resolve(results[0]);
        });
    });
}

function create(strategy: Strategy): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Database.instance.query('INSERT INTO strategies SET ?', strategy, async (err: MysqlError | null) => {
            if (err) {
                Logger.error('strategies', `Error creating strategy: ${err}`);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function update(strategy: Strategy): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Database.instance.query('UPDATE strategies SET ? WHERE id = ?', [strategy, strategy.id], async (err: MysqlError | null) => {
            if (err) {
                Logger.error('strategies', `Error updating strategy: ${err}`);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function remove(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Database.instance.query('DELETE FROM strategies WHERE id = ?', [id], async (err: MysqlError | null) => {
            if (err) {
                Logger.error('strategies', `Error deleting strategy: ${err}`);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

export default {
    getAll,
    get,
    create,
    update,
    remove,
}


