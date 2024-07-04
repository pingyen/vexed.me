import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const url = process.argv[2];
const stdout = process.stdout;
const stderr = process.stderr;

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();

    try {
      await page.setRequestInterception(true);

      page.on('request', req => {
        switch (req.resourceType()) {
          case 'font':
          case 'image':
          case 'manifest':
          case 'media':
          case 'stylesheet':
            req.abort();
            return;
          case 'document': {
            const url = req.url();

            if (url.startsWith('https://www.youtube.com/') === true ||
                url.startsWith('https://www.facebook.com/') === true ||
                url.startsWith('https://platform.twitter.com/') === true ||
                url.startsWith('https://www.instagram.com/') === true) {
              req.abort();
              return;
            }
          }
        }

        req.continue();
      });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      stdout.write(await page.content());
    } catch (e) {
      stderr.write(typeof e === 'string' ? e : (e as Error).toString());
    } finally {
      await page.close();
    }
  } catch (e) {
    stderr.write(typeof e === 'string' ? e : (e as Error).toString());
  } finally {
    try {
      await browser.close();
    } catch (e) {
      stderr.write(typeof e === 'string' ? e : (e as Error).toString());
      browser.process()!.kill(9);
    }
  }
})();
