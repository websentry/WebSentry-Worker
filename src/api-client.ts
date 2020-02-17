import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';

import {config} from "./config";


async function init() {
    return await sendApiRequest('init', {}, null, false);
}

async function fetchTask() {
    return await sendApiRequest('fetch_task', {}, null, true);
}

async function submitTask(taskid, feedback, msg, image_buffer) {
    let args = {}
    args['taskId'] = taskid;
    args['feedback'] = feedback;
    args['msg'] = msg;

    // retry
    let retry = 0;
    while (true) {
        try {
            let data = await sendApiRequest('submit_task', args, image_buffer, false);
            return data;
        } catch (error) {
            // TODO: log
            if (retry >= 3) {
                throw( error );
            }
        }
        retry++;
    }
}

async function sendApiRequest(method, args, binary, is_long_polling) {
    // Currently we don't handle the timeout case for long polling.
    // We rely on the server side to close the request so the timeout for 
    // long polling should be longer than the server side long polling.
    let timeout = is_long_polling ? 120 * 1000 : 10 * 1000;
    let options : AxiosRequestConfig = {
        timeout: timeout,
        url: config.apiServer + method,
        method: 'post',
        params: args,
        headers: {},
    };

    if (binary != null) {
        let form = new FormData();
        form.append('image', binary, 'image.jpg');

        options.data = form;
        options.headers = form.getHeaders();
    }

    options.headers['WS-Slave-Key'] = config.slaveKey;

    let res = await axios.request(options);
    return res.data;
}

export {init, fetchTask, submitTask};
