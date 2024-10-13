import { MysqlError } from 'mysql';
import Database from './index';

async function createMapsTable() {
    return new Promise((resolve, reject) => {
        Database.instance.query(`
            CREATE TABLE IF NOT EXISTS maps (
                id INT PRIMARY KEY AUTO_INCREMENT,
                uuid VARCHAR(255) UNIQUE,
                displayName VARCHAR(255),
                displayIcon VARCHAR(255),
                listViewIcon VARCHAR(255),
                listViewIconTall VARCHAR(255),
                splash VARCHAR(255),
                stylizedBackgroundImage VARCHAR(255),
                premierBackgroundImage VARCHAR(255),
                gamemode VARCHAR(255) DEFAULT 'competitive',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `, (err: MysqlError) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

async function createTables() {
    await createMapsTable();
}

export default createTables;