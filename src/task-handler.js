const fs = require('fs')
const puppeteer = require('puppeteer');

function runTask() {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        const buffer = await page.screenshot();

        fs.writeFile('test.png', buffer, 'binary', function(err){
            if (err) throw err;
            console.log('File saved.');
        });

        await browser.close();
    })();
}

exports.runTask = runTask;
