import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const sizes = await page.evaluate(() => {
  const titles = [...document.querySelectorAll('p,div')].filter(el =>
    el.children.length === 0 && /^(Monthly cloud spend|Avg. daily spend|Projected monthly spend|Monthly potential savings|Anomalies|Monthly cost by cost centers|Financial Plans|Year-end cost projection|Monthly cost changes \(year to date\)|Recent daily optimization recommendations|Top monthly spend by service|Recent activity)$/.test(el.textContent.trim()));
  return titles.map(el => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const card = el.closest('[class*="border"]');
    const overflows = card ? r.right > card.getBoundingClientRect().right + 1 : false;
    return [el.textContent.trim().slice(0,30), cs.fontSize, cs.lineHeight, cs.fontWeight, overflows];
  });
});
sizes.forEach(s => console.log(s.join(' | ')));
await browser.close();
