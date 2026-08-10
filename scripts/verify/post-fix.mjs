import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.setViewportSize({ width: 1512, height: 900 });
// 1. folder filter now works
await page.goto('http://localhost:3000/virtual-tags', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.getByText('Folders', { exact: true }).click();
await page.waitForTimeout(300);
await page.getByText('Folder name', { exact: true }).first().click();
await page.waitForTimeout(500);
const rows = await page.locator('p:text-is("ProfitPulse")').count();
const hidden = await page.locator('p:text-is("MarketMetrics")').count();
console.log((rows === 1 && hidden === 0 ? 'PASS' : 'FAIL') + ` folder-filter-real :: ProfitPulse=${rows} MarketMetrics=${hidden}`);
// 2. TopNav Share Link on virtual-tags shows a toast
await page.getByText('Share Link', { exact: true }).click();
await page.waitForTimeout(500);
const toast = await page.locator('text=/copied|Couldn/i').count();
console.log((toast >= 1 ? 'PASS' : 'FAIL') + ` share-link-topnav :: toasts=${toast}`);
await browser.close();
