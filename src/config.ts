import * as dotenv from 'dotenv';

class Config {
    apiServer: string;
    workerKey: string;
    workerId: string;
}

dotenv.config();
const config = new Config();
config.apiServer = process.env["WS_API_SERVER"];
config.workerKey = process.env["WS_WORKER_KEY"];
config.workerId = process.env["WS_WORKER_ID"];

export {config};
