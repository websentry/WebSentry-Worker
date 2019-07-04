const puppeteer = require('puppeteer');
const sharp = require('sharp');

async function runTask(task) {
    const browser = await puppeteer.launch({
        executablePath: 'google-chrome-unstable',
        args: ['--disable-dev-shm-usage']
    });
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
    if (task['output']['type']=='png') {
        buffer = await image.png().toBuffer();
    }

    await browser.close();

    return buffer;
}

exports.runTask = runTask;
