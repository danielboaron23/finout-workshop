import { chromium } from 'playwright';
const [url, out, w, h, clickText] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
if (clickText) { await page.getByText(clickText, { exact: true }).first().click(); await page.waitForTimeout(600); }
await page.screenshot({ path: out });
await browser.close();
