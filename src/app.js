const taskHandler = require('./task-handler.js');

function main() {
    console.log('Hello World!');

    test();
}

// ------
function test() {
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

    taskHandler.runTask(task);
}
// ------


exports.main = main;
