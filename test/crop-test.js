const fs = require('fs');
const taskHandler = require('./../src/task-handler.js');

(async () => {
    let testUrl = "https://www.google.com/";

    let task1 = {
        "url": testUrl,
        "timeout": 20000,
        "fullPage": true,
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

    let task2 = {
        "url": testUrl,
        "timeout": 20000,
        "fullPage": false,
        "clip": {
            "x": 239,
            "width": 503,
            "height": 278,
            "y": 174
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

    // -----------

    buffer1 = await taskHandler.runTask(task1);
    buffer2 = await taskHandler.runTask(task2);

    fs.writeFile("./1_2.jpg", buffer1, function(err) {
        if(err) {
            return console.log(err);
        }
    });
    fs.writeFile("./2_2.jpg", buffer2, function(err) {
        if(err) {
            return console.log(err);
        }
    });



})();
