import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
const BASE = 'https://danielboaron23.github.io/finout-workshop-demo';
const bad = [];
page.on('response', r => { if (r.status() >= 400 && !r.url().includes('favicon')) bad.push(r.status() + ' ' + r.url().slice(-70)); });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: process.argv[2] + '/live-home.png' });
// nav to megabill via sidebar
await page.getByText('MegaBill', { exact: true }).first().click();
await page.waitForTimeout(1800);
console.log('after nav url:', page.url());
await page.screenshot({ path: process.argv[2] + '/live-megabill.png' });
// storybook
await page.goto(BASE + '/storybook/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.screenshot({ path: process.argv[2] + '/live-storybook.png' });
console.log('failed requests:', bad.length);
bad.slice(0, 8).forEach(b => console.log('  ', b));
await browser.close();
