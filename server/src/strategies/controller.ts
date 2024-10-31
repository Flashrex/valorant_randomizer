import model from './model';
import Logger from '../misc/logger';
import { Request, Response } from "express";
import { Strategy } from '../types/Strategy';

async function listStrategies(req: Request, res: Response) {
    try {
        let strategies = await model.getAll() as Strategy[];

        strategies = strategies.map(({ id, uuid, ...rest}) => rest); 

        res.json(strategies);
    } catch (err) {
        Logger.error('strategies', `Error listing strategies: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}

async function getStrategy(req: Request, res: Response) {
    try {
        let strategy = await model.get(parseInt(req.params.id)) as Strategy;

        res.json(strategy);
    } catch (err) {
        Logger.error('strategies', `Error getting strategy: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}

async function createStrategy(req: Request, res: Response) {
    try {
        let strategy = req.body as Strategy;

        await model.create(strategy);

        res.status(201).send();
    } catch (err) {
        Logger.error('strategies', `Error creating strategy: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}

async function updateStrategy(req: Request, res: Response) {
    try {
        let strategy = req.body as Strategy;

        await model.update(strategy);

        res.status(200).send();
    } catch (err) {
        Logger.error('strategies', `Error updating strategy: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteStrategy(req: Request, res: Response) {
    try {
        await model.remove(parseInt(req.params.id));

        res.status(200).send();
    } catch (err) {
        Logger.error('strategies', `Error deleting strategy: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}

export {
    listStrategies,
    getStrategy,
    createStrategy,
    updateStrategy,
    deleteStrategy,
}

