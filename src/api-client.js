var request = require('requestretry');
const UrlAssembler = require('url-assembler');

const config = require('./../config/config.js');


function init() {
    return sendApiRequest('init', {}, null);
}

function fetchTask() {
    return sendApiRequest('fetchTask', {}, null);
}

function submitTask(taskid, feedback, msg, image_buffer) {
    args = {}
    args['taskid'] = taskid;
    args['feedback'] = feedback;
    args['msg'] = msg;
    return sendApiRequest('submitTask', args, feedback);
}

function sendApiRequest(method, args, binary) {
    args['sid'] = config.slave_id;
    args['key'] = config.key;
    url = UrlAssembler(config.api_server).template(method).query(args)
                                                                .toString();

    return new Promise((resolve, reject) => {
        let option = {
              url: url,
              json: true,
              maxAttempts: 3,
              retryDelay: 1000,
              retryStrategy: request.RetryStrategies.HTTPOrNetworkError
            }

        if (binary !== null) {
            option['multipart'] = [{body: binary}];
        }

        request.post(option, function(err, response, body){
            if (err) reject(err)
            else resolve(body);
        });
    });

}

exports.init = init;
exports.fetchTask = fetchTask;
exports.submitTask = submitTask;
