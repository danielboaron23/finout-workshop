import { chromium } from 'playwright';
const [url, out, w, h, scrollY] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.evaluate((y) => {
  document.querySelectorAll('.overflow-y-auto').forEach(el => { if (el.clientWidth > 400) el.scrollTo(0, +y); });
}, scrollY);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
