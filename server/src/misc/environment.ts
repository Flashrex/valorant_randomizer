import 'dotenv/config';
import Logger from '../misc/logger';

const ENV = {
    FRONTEND_PORT: process.env.FRONTEND_PORT,
    APP_PORT: process.env.BACKEND_PORT,
    DATABASE_HOST: process.env.MYSQL_HOST,  
    DATABASE_PORT: process.env.MYSQL_PORT,
    DATABASE_USER: process.env.MYSQL_USER,
    DATABASE_PASSWORD: process.env.MYSQL_PASSWORD,
    DATABASE_NAME: process.env.MYSQL_DATABASE,
    ENVIRONMENT: process.env.ENVIRONMENT,
};

Object.entries(ENV).forEach(([key, value]) => {
    if (!value) {
        Logger.error("app", `${key} is not set`);
        process.exit(1);
    }
});

export default ENV;