import * as dotenv from 'dotenv';

class Config {
    apiServer: string;
    slaveKey: string;
    slaveId: string;
}

dotenv.config();
const config = new Config();
config.apiServer = process.env["WS_API_SERVER"];
config.slaveKey = process.env["WS_SLAVE_KEY"];
config.slaveId = process.env["WS_SLAVE_ID"];

export {config};
