import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const out = await page.evaluate(() => {
  const names = ['Monthly cloud spend','Avg. daily spend','Projected monthly spend','Monthly potential savings','Anomalies','Monthly cost by cost centers','Financial Plans','Virtual Tags','Dashboards','Cost Centers','Year-end cost projection','Monthly cost changes (year to date)','Recent daily optimization recommendations','Top monthly spend by service','Recent activity'];
  const els = [...document.querySelectorAll('p,div')].filter(el => el.children.length===0 && names.includes(el.textContent.trim()) && getComputedStyle(el).fontWeight==='500' && parseFloat(getComputedStyle(el).fontSize) > 15);
  return els.map(el => {
    const cs = getComputedStyle(el);
    const lines = Math.round(el.getBoundingClientRect().height / parseFloat(cs.lineHeight));
    const card = el.closest('[class*="border"]');
    const overflow = card ? el.getBoundingClientRect().right > card.getBoundingClientRect().right + 1 : false;
    return `${el.textContent.trim().slice(0,32)} | ${cs.fontSize}/${cs.lineHeight} | lines:${lines} | overflow:${overflow}`;
  });
});
out.forEach(l => console.log(l));
await browser.close();
