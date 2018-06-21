const taskHandler = require('./task-handler.js');

function main() {
    console.log('Hello World!');

    test();
}

// ------
function test() {
    taskHandler.runTask();
}
// ------


exports.main = main;
