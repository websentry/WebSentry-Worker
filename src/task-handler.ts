import * as puppeteer from 'puppeteer';
import * as sharp from 'sharp';

async function runTask(task) {
    const browser = await puppeteer.launch({
        executablePath: 'google-chrome-unstable',
        args: ['--disable-dev-shm-usage']
    });

    try {

        const page = await browser.newPage();

        let viewport = task['viewport'];
        if (viewport['height'] === undefined) viewport['height'] = 1024;

        await page.setViewport(viewport);
        await page.goto(task['url'], {
            timeout: task['timeout'],
            waitUntil: "networkidle2"
        });

        const image = sharp(await page.screenshot({
            fullPage: task['fullPage'],
            clip: task['clip']
        }));

        let buffer;
        if (task['output']['type'] === 'jpg') {
            let options = {
                quality: task['output']['quality'],
                progressive: task['output']['progressive']
            };
            buffer = await image.jpeg(options).toBuffer();
        }
        if (task['output']['type'] === 'png') {
            buffer = await image.png().toBuffer();
        }

        return buffer;

    } finally {
        await browser.close();
    }
}

export { runTask };
