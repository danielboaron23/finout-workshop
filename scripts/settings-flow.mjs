/* Walks the Settings staged-change flow and screenshots each step.
   node scripts/settings-flow.mjs <outDir> [port]
   Clicks go through page.evaluate — the .app-zoom on <body> breaks Playwright
   hit-testing, same as every other flow script in here. */
import { chromium } from 'playwright';
const out = process.argv[2];
const port = process.argv[3] ?? '3000';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1400 }, deviceScaleFactor: 1 });
const errs = [];
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));

/* Match the deepest node carrying the text, then click the nearest real
   control above it. Matching an ancestor instead clicks a wrapper that sits
   ABOVE the handler, and the event never reaches it. */
const clickText = (t) => p.evaluate((txt) => {
  const el = [...document.querySelectorAll('*')]
    .filter(e => e.children.length === 0 && e.textContent.trim() === txt)[0];
  if (!el) throw new Error('not found: ' + txt);
  (el.closest('button,a,[class*="cursor-pointer"]') || el.parentElement).click();
}, t);

await p.goto(`http://localhost:${port}/settings#cost-model`, { waitUntil: 'networkidle' });
await p.waitForTimeout(700);

await clickText('Direct only');
await p.waitForTimeout(400);
await p.screenshot({ path: `${out}/flow-1-open.png` });

await clickText('Even split across teams');
await p.waitForTimeout(1200);
await p.screenshot({ path: `${out}/flow-2-impact.png` });

// reach into closed history
await clickText('Effective: August');
await p.waitForTimeout(400);
await clickText('All history, back to March 2026');
await p.waitForTimeout(500);
await p.screenshot({ path: `${out}/flow-3-restate.png` });

await clickText('Restate 5 closed periods');
await p.waitForTimeout(400);
await p.screenshot({ path: `${out}/flow-4-confirm.png` });

console.log('ERRORS:', errs.length ? errs.join('\n') : 'none');
await b.close();
