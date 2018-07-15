const http = require('http');
const url = require('url');

const key = 'testkey';

let taskCount = 2;


http.createServer(function (req, res) {
    let urlParts = url.parse(req.url);
    console.log(req.url);

    switch(urlParts.pathname) {
        case "/":
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('OK');
            res.end();
            break;

        case "/v1/slave/init":
            init(req, res);
            break;
        case "/v1/slave/fetchTask":
            fetchTask(req, res);
            break;
        case "/v1/slave/submitTask":
            submitTask(req, res);
            break;

        default:
            res.writeHead(404);
            res.end();
            break;
    }
}).listen(8088);

console.log("Server running at http://127.0.0.1:8088/");

function responseJson(res, obj) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(JSON.stringify(obj));
    res.end();
}


function init(req, res) {
    let query = url.parse(req.url, true).query;
    let obj = {};
    if (query['key'] == key) {
        obj['code'] = 1;
        obj['msg'] = 'OK';
    } else {
        obj['code'] = -1;
        obj['msg'] = 'Wrong key.';
    }
    responseJson(res, obj);
}

function fetchTask(req, res) {
    let query = url.parse(req.url, true).query;
    let obj = {};

    if (query['key'] != key) {
        obj['code'] = -1;
        obj['msg'] = 'Wrong key.';
        responseJson(res, obj);
        return;
    }


    if (taskCount>=1) {
        taskCount -= 1;
    } else {
        responseJson(res, {code: 0});
        return;
    }


    let task = {
        "url": "https://store.steampowered.com/stats/Steam-Game-and-Player-Statistics?l=english",
        "timeout": 20000,
        "fullPage": false,
        "clip": {
            "x": 0,
            "width": 500,
            "height": 1024,
            "y": 1024
        },
        "viewport": {
            "width": 500,
            "isMobile": false
        },
        "output": {
            "type": "jpg",
            "progressive": true,
            "quality": 80
        }
    };

    obj['code'] = 1;
    obj['msg'] = 'OK';
    obj['taskid'] = 1001;
    obj['task'] = task;

    responseJson(res, obj);
}

function submitTask(req, res) {
    let query = url.parse(req.url, true).query;
    let obj = {};

    if (query['key'] != key) {
        obj['code'] = -1;
        obj['msg'] = 'Wrong key.';
        responseJson(res, obj);
        return;
    }

    console.log(query);

    obj['code'] = 1;
    obj['msg'] = 'OK';

    responseJson(res, obj);
}
