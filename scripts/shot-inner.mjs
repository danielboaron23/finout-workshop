import { chromium } from 'playwright';
const [url, out, w] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  document.querySelectorAll('.overflow-y-auto,.overflow-hidden,.h-full').forEach(el => {
    el.style.overflow = 'visible'; el.style.height = 'auto';
  });
  const b = document.body; b.style.height='auto'; b.style.overflow='visible';
});
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
