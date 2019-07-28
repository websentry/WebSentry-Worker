import * as taskHandler from './task-handler';
import * as api from './api-client';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function log(msg) {
    var now = new Date();
    var date = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
    var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var dateTime = date + ' ' + time;
    console.log(dateTime + ": " + msg);
}

async function main() {
    while (true) {
        if (!await establishConnection()) {
            return;
        }

        await doTask();
    }
}

async function establishConnection() {
    while (true) {
        try {
            let data = await api.init();
            if (data['code']<0) {
                log('[establishConnection] ' + data);
                return false;
            } else {
                log('[establishConnection] success');
                return true;
            }
        } catch (e) {
            log('[establishConnection] ' + e);
            log('retry after 2 mins');
            await sleep(2 * 60 * 1000);
        }
    }
}

async function doTask() {
    while (true) {
        try {
            // long polling
            let data;
            while (true) {
                data = await api.fetchTask();
                if (data['code'] != 0) throw data;
                data = data['data'];
                if (data['taskId'] >= 0) {
                    break;
                }
            }

            log('[doTask] Task: ' + data['taskId']);
            let feedback = 0, msg = "OK", buffer = null;
            
            try {
                buffer = await taskHandler.runTask(data['task']);
            } catch (e) {
                feedback = -1;
                msg = e.toString();
            }

            const result =
                    await api.submitTask(data['taskId'], feedback, msg, buffer);
            if (result['code'] < 0) {
                throw new Error(JSON.stringify(result));
            }
            log('[doTask] Task done: ' + data['taskId']);
        } catch (e) {
            // connection issue
            log('[doTask] ' + e);
            await sleep(5 * 1000);
            return;
        }
    }
}


export {main};
