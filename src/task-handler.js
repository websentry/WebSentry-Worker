const fs = require('fs')
const puppeteer = require('puppeteer');
const sharp = require('sharp');

function runTask(task) {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let viewport = task['viewport'];
        if (viewport['height'] === undefined) viewport['height'] = 1024;

        await page.setViewport(viewport);
        await page.goto(task['url'], {timeout: task['timeout']});
        let options = {fullPage: task['fullPage'], clip: task['clip']};

        const image = sharp(await page.screenshot(options));

        let buffer;

        if (task['output']['type']=='jpg') {
            let options = {quality: task['output']['quality'],
                           progressive: task['output']['progressive']};
            buffer = await image.jpeg(options).toBuffer();
        }

        fs.writeFile('test.jpg', buffer, 'binary', function(err){
            if (err) throw err;
            console.log('File saved.');
        });

        await browser.close();
    })();
}

exports.runTask = runTask;
