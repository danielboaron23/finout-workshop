import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 800 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const widths = await page.evaluate(() => {
  const meas = document.createElement('span');
  meas.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-family:"Helvetica Neue",Inter,sans-serif;font-weight:500;font-size:20px';
  document.body.appendChild(meas);
  const titles = ['Monthly cloud spend','Avg. daily spend','Projected monthly spend','Monthly potential savings','Anomalies','Year-end cost projection'];
  return titles.map(t => { meas.textContent = t; return [t, Math.ceil(meas.getBoundingClientRect().width)]; });
});
console.log(JSON.stringify(widths));
await browser.close();
