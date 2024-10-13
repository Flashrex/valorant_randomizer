import Database from '../database/index';
import Logger from '../misc/logger';

async function fetchMaps() {
    const response = await fetch('https://valorant-api.com/v1/maps');
    const data = await response.json();
    return data.data;
}

async function updateMaps() {
    const maps = await fetchMaps();
    
    const mappedMaps = maps.map((map: any) => {
        return {
            uuid: map.uuid,
            displayName: map.displayName,
            displayIcon: map.displayIcon,
            listViewIcon: map.listViewIcon,
            listViewIconTall: map.listViewIconTall,
            splash: map.splash,
            stylizedBackgroundImage: map.stylizedBackgroundImage,
            premierBackgroundImage: map.premierBackgroundImage,
        };
    });

    const db = Database.instance;

    if (!db.isConnected) {
        Logger.error('maps', 'Database is not connected');
        return;
    }

    for (const map of mappedMaps) {

        db.query('SELECT * FROM maps WHERE uuid = ?', [map.uuid], async (err, results) => {
            if (err) {
                Logger.error('maps', `Error while fetching map: ${err}`);
                return;
            }

            if (results.length > 0) {
                await db.query('UPDATE maps SET ? WHERE uuid = ?', [map, map.uuid]);
                return;
            } else {
                await db.query('INSERT INTO maps SET ?', map);
            }
        });
    }

    Logger.log('maps', `Updated ${mappedMaps.length} maps`);
}

export {
    updateMaps
}