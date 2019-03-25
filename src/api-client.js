const request = require('requestretry');
const UrlAssembler = require('url-assembler');

const config = require('./../config/config.js');


function init() {
    return sendApiRequest('init', {}, null);
}

function fetchTask() {
    return sendApiRequest('fetch_task', {}, null);
}

function submitTask(taskid, feedback, msg, image_buffer) {
    args = {}
    args['taskId'] = taskid;
    args['feedback'] = feedback;
    args['msg'] = msg;
    return sendApiRequest('submit_task', args, image_buffer);
}

function sendApiRequest(method, args, binary) {
    args['sid'] = config.slave_id;
    url = UrlAssembler(config.api_server).template(method).query(args)
                                                                .toString();

    return new Promise((resolve, reject) => {
        let option = {
              url: url,
              headers: {
                'WS-Slave-Key': config.key
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

exports.init = init;
exports.fetchTask = fetchTask;
exports.submitTask = submitTask;
