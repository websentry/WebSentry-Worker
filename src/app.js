const taskHandler = require('./task-handler.js');
const api = require('./api-client.js');



function main() {
    establishConnection()
}

// the client has 3 state:
//    1. establishing connection
//    2. working
//    3. waiting

function establishConnection() {
    (async () => {
        try {
            data = await api.init();
            if (data['code']<0) {
                console.log('[establishConnection] ' + data);
                return;
            } else {
                console.log('[establishConnection] success');
                // success, goto working state
                doTask();
                return;
            }
        } catch (e) {
            console.log('[establishConnection] ' + e);
            console.log('retry after 2 mins');

            setTimeout(establishConnection, 2*60*1000);
        }
    })();
}

function doTask() {
    (async () => {
        try {
            const data = await api.fetchTask();
            if (data['code']!=0) throw data;

            if (data['taskId']<0) {
                // next long polling request
                doTask();
                return
            }

            console.log('[doTask] Task: '+data['taskId']);
            let feedback = 0, msg = "OK", buffer = null;

            try {
                buffer = await taskHandler.runTask(data['task']);
            } catch (e) {
                feedback = -1;
                msg = e.toString();
            }

            const result =
                    await api.submitTask(data['taskId'], feedback, msg, buffer);
            if (result['code']<0) throw result;
            console.log('[doTask] Task done: '+data['taskId']);
            // start next task
            doTask();

        } catch (e) {
            // connection issue
            console.log('[doTask] ' + e);
            setTimeout(establishConnection, 5*1000);
        }
    })();
}


exports.main = main;
