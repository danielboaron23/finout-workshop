import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'Go to scan');
  const b = btns[0];
  const cell = b?.parentElement;
  const col = cell?.parentElement;
  const cs = cell ? getComputedStyle(cell) : null;
  return {
    btnW: b?.getBoundingClientRect().width,
    cellW: cell?.getBoundingClientRect().width,
    colW: col?.getBoundingClientRect().width,
    cellPad: cs ? cs.paddingLeft + ' ' + cs.paddingRight : null,
    btnFont: b ? getComputedStyle(b).fontFamily.slice(0,60) : null,
    pFont: b ? getComputedStyle(b.querySelector('p')).fontFamily.slice(0,60) : null,
  };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
