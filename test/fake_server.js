const http = require('http');
const url = require('url');
const formidable = require('formidable');


const key = 'testkey';

let taskCount = 1;
let startTime = null;


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
        case "/v1/slave/fetch_task":
            fetchTask(req, res);
            break;
        case "/v1/slave/submit_task":
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

function checkKey(req, res) {
    if (req.headers['ws-slave-key'] != key) {
        let obj = {};
        obj['code'] = -1;
        obj['msg'] = 'Wrong key.';
        responseJson(res, obj);
        return false;
    }
    return true;
}


function init(req, res) {
    let query = url.parse(req.url, true).query;
    let obj = {};
    
    if (!checkKey(req, res)) return;

    obj['code'] = 0;
    obj['msg'] = 'OK';
    responseJson(res, obj);
}

function fetchTask(req, res) {
    let query = url.parse(req.url, true).query;
    let obj = {};

    if (!checkKey(req, res)) return;

    if (taskCount>=1) {
        taskCount -= 1;
    } else {
        setTimeout(function() {
            responseJson(res, {code: 0, data: {taskId: -1}});
        }, 30 * 1000);
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

    obj['code'] = 0;
    obj['msg'] = 'OK';
    obj['data'] = {};
    obj['data']['taskId'] = 1001;
    obj['data']['task'] = task;

    responseJson(res, obj);
    startTime = new Date();
}

function submitTask(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./tmpdir";
    form.parse(req, function (err, fields, files) {
        console.log(err);
        console.log(files);
        console.log(req.headers);

        let query = url.parse(req.url, true).query;
        let obj = {};
    
        if (!checkKey(req, res)) return;
    
        console.log(query);
    
        obj['code'] = 1;
        obj['msg'] = 'OK';
    
        responseJson(res, obj);
        let timeUsed = ((new Date()).getTime() - startTime.getTime()) / 1000;
        console.log("Time used: " + timeUsed + "s");
    });
};
