import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';

import {config} from "./config";


async function init() {
    return await sendApiRequest('init', {}, null);
}

async function fetchTask() {
    return await sendApiRequest('fetch_task', {}, null);
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
            let data = await sendApiRequest('submit_task', args, image_buffer);
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

async function sendApiRequest(method, args, binary) {
    let options : AxiosRequestConfig = {
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
