import { chromium } from 'playwright';
const [url, out, w, h] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: out });
await browser.close();
