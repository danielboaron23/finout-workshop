/*
 * Cross-page integrity verifier for the Finout workshop app (localhost:3000).
 * Run from repo root: node scripts/verify/cross-page.mjs
 * Prints one line per check: "PASS <name>" or "FAIL <name> :: <detail>".
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];

function report(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(pass ? `PASS ${name} :: ${detail}` : `FAIL ${name} :: ${detail}`);
}

const IGNORE = [/favicon/i, /DevTools/i, /net::ERR_/, /404 \(Not Found\)/];

function collectErrors(page, sink) {
  page.on("console", (msg) => {
    if (msg.type() === "error") sink.push(msg.text());
  });
  page.on("pageerror", (err) => sink.push(`pageerror: ${err.message}`));
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });

// ---------------------------------------------------------------- check 1
// console-clean-<route> for each route
const routes = ["/", "/virtual-tags", "/anomalies", "/anomalies/create", "/megabill"];
for (const route of routes) {
  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
  const name = `console-clean-${slug}`;
  try {
    const page = await context.newPage();
    const errors = [];
    collectErrors(page, errors);
    await page.goto(BASE + route, { waitUntil: "load", timeout: 20000 });
    await page.waitForTimeout(800);
    const relevant = errors.filter((t) => !IGNORE.some((re) => re.test(t)));
    const bad = relevant.filter((t) => t.includes("Hydration") || t.includes("Error"));
    if (bad.length > 0) {
      report(name, false, `first error: ${bad[0].slice(0, 200)}`);
    } else if (relevant.length > 0) {
      report(name, true, `no Hydration/Error console errors (other console noise: ${relevant[0].slice(0, 120)})`);
    } else {
      report(name, true, "no console errors on load");
    }
    await page.close();
  } catch (e) {
    report(name, false, `script error: ${e.message.slice(0, 160)}`);
  }
}

// ---------------------------------------------------------------- check 2
// nav-matrix: Overview -> MegaBill -> Virtual tags -> Anomalies -> Overview
try {
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(400);
  const steps = [
    ["MegaBill", "**/megabill"],
    ["Virtual tags", "**/virtual-tags"],
    ["Anomalies", "**/anomalies"],
    ["Overview", null], // pathname === "/"
  ];
  const visited = [];
  for (const [label, urlGlob] of steps) {
    await page.getByRole("link", { name: label, exact: true }).click();
    if (urlGlob) {
      await page.waitForURL(urlGlob, { timeout: 10000 });
    } else {
      await page.waitForURL((u) => u.pathname === "/", { timeout: 10000 });
    }
    await page.waitForTimeout(300);
    visited.push(`${label}=>${new URL(page.url()).pathname}`);
  }
  report("nav-matrix", true, `URL sequence: ${visited.join(", ")}`);
  await page.close();
} catch (e) {
  report("nav-matrix", false, `navigation failed: ${e.message.slice(0, 160)}`);
}

// ---------------------------------------------------------------- check 3
// kpi-cta: first "Investigate in MegaBill" on / navigates to /megabill
try {
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(400);
  await page.getByText("Investigate in MegaBill").first().click();
  await page.waitForURL("**/megabill", { timeout: 10000 });
  await page.waitForTimeout(300);
  report("kpi-cta", true, `landed on ${new URL(page.url()).pathname}`);
  await page.close();
} catch (e) {
  report("kpi-cta", false, `CTA click did not reach /megabill: ${e.message.slice(0, 160)}`);
}

// ---------------------------------------------------------------- checks 4+5
// zoom at 1280x800 (~0.667) and 2560x1200 (~1.333), no horizontal scrollbar at 1280
async function checkZoom(name, width, height, expected) {
  try {
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 20000 });
    await page.waitForTimeout(500);
    const state = await page.evaluate(() => ({
      zoom: getComputedStyle(document.body).zoom,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    const zoomNum = parseFloat(state.zoom);
    const zoomOk = Number.isFinite(zoomNum) && Math.abs(zoomNum - expected) <= 0.01;
    let detail = `body zoom=${state.zoom} (expected ~${expected}), scrollWidth=${state.scrollWidth}, innerWidth=${state.innerWidth}`;
    if (name === "zoom-1280") {
      const noHScroll = state.scrollWidth <= state.innerWidth + 2;
      report(name, zoomOk && noHScroll, detail + (noHScroll ? ", no horizontal scrollbar" : ", HAS horizontal overflow"));
    } else {
      report(name, zoomOk, detail);
    }
    await page.close();
  } catch (e) {
    report(name, false, `script error: ${e.message.slice(0, 160)}`);
  }
}
await checkZoom("zoom-1280", 1280, 800, 0.667);
await checkZoom("zoom-2560", 2560, 1200, 1.333);

// ---------------------------------------------------------------- check 6
// store-isolation: create a virtual tag in context A; a fresh context must not see it
try {
  const pageA = await context.newPage();
  await pageA.setViewportSize({ width: 1920, height: 1080 });
  await pageA.goto(BASE + "/virtual-tags", { waitUntil: "load", timeout: 20000 });
  await pageA.waitForTimeout(500);
  const beforeCount = await pageA.locator("text=/NewVirtualTag-\\d+/").count();
  await pageA.getByText("Create Virtual Tag", { exact: true }).click();
  await pageA.waitForTimeout(300);
  await pageA.getByText("New Virtual Tag", { exact: true }).click();
  await pageA.waitForTimeout(600);
  const createdLoc = pageA.locator("text=/NewVirtualTag-\\d+/");
  const afterCount = await createdLoc.count();
  if (afterCount <= beforeCount) {
    report("store-isolation", false, `tag creation did not add a row (before=${beforeCount}, after=${afterCount})`);
  } else {
    const createdName = (await createdLoc.last().textContent())?.trim();
    const storedA = await pageA.evaluate((k) => window.sessionStorage.getItem(k) !== null, "vt-rows");
    // fresh context = fresh sessionStorage = a different "user"
    const contextB = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const pageB = await contextB.newPage();
    await pageB.goto(BASE + "/virtual-tags", { waitUntil: "load", timeout: 20000 });
    await pageB.waitForTimeout(500);
    const leakCount = await pageB.getByText(createdName, { exact: true }).count();
    const storedB = await pageB.evaluate((k) => window.sessionStorage.getItem(k), "vt-rows");
    if (leakCount === 0 && storedB === null) {
      report(
        "store-isolation",
        true,
        `"${createdName}" visible in context A (sessionStorage vt-rows set=${storedA}); fresh context shows 0 matches and vt-rows=null`,
      );
    } else {
      report(
        "store-isolation",
        false,
        `leak detected: "${createdName}" matches in fresh context=${leakCount}, vt-rows=${storedB === null ? "null" : "present"}`,
      );
    }
    await contextB.close();
  }
  await pageA.close();
} catch (e) {
  report("store-isolation", false, `script error: ${e.message.slice(0, 160)}`);
}

await browser.close();

const failed = results.filter((r) => !r.pass).length;
console.log(`\nDONE ${results.length - failed}/${results.length} passed`);
