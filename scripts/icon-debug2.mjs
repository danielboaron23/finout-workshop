import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://localhost:3000/megabill', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('img[src*="/icons/megabill/"]').forEach(img => {
    if (!img.complete || img.naturalWidth === 0) out.push('BROKEN: ' + img.src.split('/').pop());
  });
  // also list which srcs are used
  const used = new Set([...document.querySelectorAll('img[src*="/icons/megabill/"]')].map(i => i.src.split('/').pop()));
  out.push('used: ' + [...used].join(', '));
  return out;
});
console.log(info.join('\n'));
await browser.close();
