import model from './model';
import Logger from '../misc/logger';
import { Request, Response } from "express";
import { Map } from '../types/Map';

async function listMaps(req: Request, res: Response) {
    try {
        let maps = await model.getAll() as Map[];

        maps = maps.filter((map: Map) => map.gamemode === (req.params.gamemode ?? 'competitive'));

        maps = maps.map(({ id, uuid, ...rest}) => rest); 

        res.json(maps);
    } catch (err) {
        Logger.error('maps', `Error listing maps: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}

export {
    listMaps,
}
