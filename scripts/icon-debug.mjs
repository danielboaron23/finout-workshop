import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://localhost:3000/megabill', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('img[src*="/icons/megabill/"]').forEach(img => {
    const r = img.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) out.push(`${img.src.split('/').pop()} ${Math.round(r.width)}x${Math.round(r.height)} parent:${img.parentElement.className.slice(0,80)}`);
  });
  return out;
});
console.log(info.join('\n') || 'all icons have size');
await browser.close();
