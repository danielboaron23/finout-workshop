/* End-to-end assertions for /settings. node scripts/settings-verify.mjs [port] */
import { chromium } from 'playwright';
const port = process.argv[2] ?? '3000';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1400 } });
const errs = [];
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const ok = [], bad = [];
const check = (name, cond) => (cond ? ok : bad).push(name);

const clickText = (t) => p.evaluate((txt) => {
  const el = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim() === txt)[0];
  if (!el) throw new Error('not found: ' + txt);
  (el.closest('button,a,[class*="cursor-pointer"]') || el.parentElement).click();
}, t);
const bodyHas = (t) => p.evaluate((txt) => document.body.innerText.includes(txt), t);

// 1. Sidebar Settings is a real link
await p.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
check('sidebar Settings links to /settings',
  await p.evaluate(() => !!document.querySelector('a[href="/settings"]')));

// 2. Deep link straight into a section
await p.goto(`http://localhost:${port}/settings#budgets`, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
check('deep link #budgets renders that section', await bodyHas('What counts as over'));
check('budgets shows Platform real July spend', await bodyHas('$101,529'));

// 3. Back steps through sections rather than leaving the screen
await clickText('Access & teams'); await p.waitForTimeout(400);
check('navigated to Access & teams', await bodyHas('Read-only in this build'));
await p.goBack(); await p.waitForTimeout(500);
check('Back returns to Budgets, still on /settings',
  (await bodyHas('What counts as over')) && p.url().includes('/settings'));

// 4. The hero flow, with the corrected Core Product figure
await p.goto(`http://localhost:${port}/settings#cost-model`, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
check('starts with nothing staged', !(await bodyHas('change staged')));
await clickText('Direct only'); await p.waitForTimeout(300);
await clickText('Even split across teams'); await p.waitForTimeout(1400);
check('impact table computed', await bodyHas('After this change'));
check('Core Product reconciles to seed ($43,315)', await bodyHas('$43,315'));
check('Growth delta is real (+$20,945)', await bodyHas('+$20,945'));
check('budget flips detected', await bodyHas('cross the budget line'));
check('staged bar appeared', await bodyHas('1 change staged'));

// 5. Publish commits, and the row stops saying "Staged"
await clickText('Publish'); await p.waitForTimeout(900);
check('publish clears the staged bar', !(await bodyHas('change staged')));
check('published value is now committed', await bodyHas('Even split across teams'));
check('publish is undoable', await bodyHas('Undo'));

console.log('PASS:'); ok.forEach(x => console.log('  ✓', x));
if (bad.length) { console.log('FAIL:'); bad.forEach(x => console.log('  ✗', x)); }
console.log('console errors:', errs.length ? errs.join(' | ') : 'none');
await b.close();
process.exit(bad.length ? 1 : 0);
