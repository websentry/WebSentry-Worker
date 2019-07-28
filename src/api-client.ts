import * as request from 'requestretry';
import * as UrlAssembler from 'url-assembler';

import {config} from "./config";


function init() {
    return sendApiRequest('init', {}, null);
}

function fetchTask() {
    return sendApiRequest('fetch_task', {}, null);
}

function submitTask(taskid, feedback, msg, image_buffer) {
    let args = {}
    args['taskId'] = taskid;
    args['feedback'] = feedback;
    args['msg'] = msg;
    return sendApiRequest('submit_task', args, image_buffer);
}

function sendApiRequest(method, args, binary) {
    args['sid'] = config.slaveId;
    let url = UrlAssembler(config.apiServer).template(method).query(args)
                                                                .toString();

    return new Promise((resolve, reject) => {
        let option = {
              url: url,
              headers: {
                'WS-Slave-Key': config.slaveKey
              },
              method: 'POST',
              json: true,
              maxAttempts: 3,
              retryDelay: 1000,
              retryStrategy: request.RetryStrategies.HTTPOrNetworkError
            };


        if (binary != null) {

            option['formData'] = {'image': {
                    'value': binary,
                    'options': {
                      'filename': 'image.jpg',
                      'contentType': 'image/jpeg'
                    }
                  }
                };
        }



        request(option, function(err, response, body){
            if (err) reject(err)
            else resolve(body);
        });
    });

}

export {init, fetchTask, submitTask};
