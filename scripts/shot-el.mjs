import { chromium } from 'playwright';
const [url, out, w, sel] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const el = page.locator(sel).first();
await el.screenshot({ path: out });
await browser.close();
