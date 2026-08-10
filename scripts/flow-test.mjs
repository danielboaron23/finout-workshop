import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1512, height: 900 } });
const log = [];
await page.goto('http://localhost:3000/anomalies', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
log.push('feed shows: ' + await page.locator('text=/\\d+ results?/').first().textContent());
// click CTA
await page.getByText('Create Anomaly Alert', { exact: true }).click();
await page.waitForURL('**/anomalies/create'); await page.waitForTimeout(800);
log.push('navigated to: ' + new URL(page.url()).pathname);
// edit alert name
const nameInput = page.locator('input').first();
await nameInput.fill('OpenAI GPT-5 Tokens');
// collapse+expand a drawer to prove interaction
await page.locator('button[aria-expanded]').first().click();
await page.waitForTimeout(200);
const collapsed = await page.locator('button[aria-expanded="false"]').count();
log.push('drawer collapsed works: ' + (collapsed >= 1));
await page.locator('button[aria-expanded]').first().click();
// Save
await page.getByText('Save', { exact: true }).click();
await page.waitForURL('**/anomalies'); await page.waitForTimeout(800);
log.push('after save: ' + new URL(page.url()).pathname + ' | ' + await page.locator('text=/\\d+ results?/').first().textContent());
log.push('new card visible: ' + await page.getByText('OpenAI GPT-5 Tokens').isVisible());
// go again and Cancel
await page.getByText('Create Anomaly Alert', { exact: true }).click();
await page.waitForURL('**/anomalies/create'); await page.waitForTimeout(500);
await page.getByText('Cancel', { exact: true }).click();
await page.waitForURL('**/anomalies'); await page.waitForTimeout(600);
log.push('after cancel: ' + await page.locator('text=/\\d+ results?/').first().textContent());
// Back link
await page.getByText('Create Anomaly Alert', { exact: true }).click();
await page.waitForURL('**/anomalies/create'); await page.waitForTimeout(500);
await page.getByText('Back to Anomalies').click();
await page.waitForURL('**/anomalies');
log.push('back link returns: ' + new URL(page.url()).pathname);
await page.screenshot({ path: process.argv[2] });
console.log(log.join('\n'));
await browser.close();
