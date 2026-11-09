import { chromium } from 'playwright';
const [url, out, w] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// capture the full scrollable content of the inner column
await page.evaluate(() => { const el = document.querySelector('.overflow-y-auto'); if (el) el.style.overflow = 'visible'; document.querySelector('.h-screen')?.classList.remove('h-screen','overflow-hidden'); });
await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
