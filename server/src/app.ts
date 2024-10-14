import Logger from './misc/logger';
import Database from './database/index';
import Server from './server';
import { updateMaps } from './maps/service';

Database.instance.connect().then(() => {
  Database.instance.checkTables();

  //starting express server
  Server.instance.start();

  //updating maps
  updateMaps();

}).catch((error) => {
  Logger.error('app', error);
  process.exit(1);
});







