// Screenshot specific slides of a deck. Usage:
//   node scripts/deck-shot.mjs <url> <outdir> <slideIndex...>
import { chromium } from 'playwright';
const url = process.argv[2], outdir = process.argv[3];
const want = process.argv.slice(4).map(Number);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
const max = Math.max(...want);
for (let i = 0; i <= max; i++) {
  if (want.includes(i)) {
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${outdir}/slide-${String(i).padStart(2, '0')}.png` });
  }
  if (i < max) await p.keyboard.press('ArrowRight');
}
await b.close();
console.log('captured', want.join(', '));
