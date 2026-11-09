import { chromium } from 'playwright';
// Usage: node scripts/sb-tour.mjs <outdir>
// Captures the Storybook manager (tree fully expanded) + selected docs pages.
const out = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto('http://localhost:6006/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
// expand all in the sidebar (keyboard shortcut or clicking group nodes)
const groups = page.locator('[data-nodetype="group"], [data-nodetype="component"]');
for (let i = 0; i < await groups.count(); i++) {
  const g = groups.nth(i);
  const expanded = await g.getAttribute('aria-expanded');
  if (expanded === 'false') await g.click().catch(() => {});
}
await page.waitForTimeout(800);
await page.screenshot({ path: `${out}/sb-tree.png` });
// capture given story iframes full-page
const shots = [
  ['design-system-welcome--docs', 'sb-welcome.png'],
  ['foundations-colors--docs', 'sb-colors.png'],
  ['foundations-typography--docs', 'sb-typography.png'],
  ['atoms-button--docs', 'sb-button.png'],
  ['molecules-kpi-card--docs', 'sb-kpicard.png'],
  ['organisms-sidebar--docs', 'sb-sidebar.png'],
];
for (const [id, file] of shots) {
  try {
    await page.goto(`http://localhost:6006/iframe.html?viewMode=docs&id=${id}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${file}`, fullPage: true });
    console.log('shot', id);
  } catch (e) { console.log('MISS', id, e.message.slice(0, 80)); }
}
await browser.close();
