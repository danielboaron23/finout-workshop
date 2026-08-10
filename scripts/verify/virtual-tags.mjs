// Verifier for /virtual-tags — run from repo root: node scripts/verify/virtual-tags.mjs
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];
const pass = (name, detail) => { results.push({ name, pass: true, detail }); console.log(`PASS ${name} :: ${detail}`); };
const fail = (name, detail) => { results.push({ name, pass: false, detail }); console.log(`FAIL ${name} :: ${detail}`); };

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

// Row names from the Name column (CellText paragraphs only, header excluded)
const names = () =>
  page.$$eval('div[class*="min-w-[160px]"] p[class*="33.898"]', (els) =>
    els.map((e) => e.textContent.trim()),
  );

// Tab label -> counter number
const tabInfo = () =>
  page.evaluate(() => {
    const labels = ["All", "Custom Virtual Tags", "Finout Virtual Tags"];
    const out = {};
    document.querySelectorAll("button").forEach((b) => {
      const p = b.querySelector("p");
      const c = b.querySelector("span span");
      if (p && c && labels.includes(p.textContent.trim()) && /^\d+$/.test(c.textContent.trim()))
        out[p.textContent.trim()] = Number(c.textContent.trim());
    });
    return out;
  });

// Modified-date column cell texts (header excluded)
const modifiedDates = () =>
  page.evaluate(() => {
    const header = [...document.querySelectorAll("p")].find((p) => p.textContent.trim() === "Modified date");
    if (!header) return null;
    const col = header.closest('div[class*="flex-col"]');
    return [...col.querySelectorAll('p[class*="33.898"]')].map((p) => p.textContent.trim());
  });

const clickTab = async (label) => {
  await page.locator('div[class*="h-[68px]"]').getByText(label, { exact: true }).click();
  await page.waitForTimeout(400);
};

await page.goto(`${BASE}/virtual-tags`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const mainSearch = page.locator('input[placeholder="Search"]').first();

// ---------- 1. search-filter ----------
try {
  await mainSearch.fill("profit");
  await page.waitForTimeout(400);
  const filtered = await names();
  const allProfit = filtered.every((n) => n.toLowerCase().includes("profit"));
  const noRadar = !filtered.includes("RevenueRadar");
  await mainSearch.fill("");
  await page.waitForTimeout(400);
  const restored = await names();
  if (filtered.length === 2 && allProfit && noRadar && restored.length === 7)
    pass("search-filter", `"profit" -> [${filtered.join(", ")}] (2 rows, RevenueRadar absent); cleared -> ${restored.length} rows`);
  else
    fail("search-filter", `"profit" -> ${filtered.length} rows [${filtered.join(", ")}]; cleared -> ${restored.length} rows`);
} catch (e) {
  fail("search-filter", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 2. tabs-filter ----------
try {
  await clickTab("Custom Virtual Tags");
  const custom = await names();
  const counters = await tabInfo();
  await clickTab("Finout Virtual Tags");
  const finout = await names();
  await clickTab("All");
  const all = await names();
  const ok =
    custom.length === 4 &&
    !custom.includes("MarketMetrics") &&
    counters["All"] === all.length &&
    counters["Custom Virtual Tags"] === 4 &&
    counters["Finout Virtual Tags"] === 3 &&
    finout.length === 3 &&
    all.length === 7;
  if (ok)
    pass("tabs-filter", `Custom=4 rows (no MarketMetrics), Finout=3 rows, All=7 rows; counters All=${counters["All"]}, Custom=${counters["Custom Virtual Tags"]}, Finout=${counters["Finout Virtual Tags"]}`);
  else
    fail("tabs-filter", `Custom=${custom.length} rows (MarketMetrics ${custom.includes("MarketMetrics") ? "present" : "absent"}), Finout=${finout.length}, All=${all.length}, counters=${JSON.stringify(counters)}`);
} catch (e) {
  fail("tabs-filter", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 3. folder-filter ----------
try {
  const trigger = page.getByRole("button", { name: "Folders" });
  await trigger.click();
  await page.waitForTimeout(400);
  const menu = page.locator('div[class*="w-[350px]"]');
  const menuOpen = (await menu.count()) === 1;
  const folderRows = menu.locator('button:has(img[src="/icons/ui/folder-menu.svg"])');
  const countBefore = await folderRows.count();
  const menuSearch = menu.locator('input[placeholder="Search"]');
  await menuSearch.fill("New");
  await page.waitForTimeout(400);
  const countFiltered = await folderRows.count();
  await menuSearch.fill("");
  await page.waitForTimeout(400);
  const countCleared = await folderRows.count();
  const firstFolderName = (await folderRows.first().innerText()).trim();
  await folderRows.first().click();
  await page.waitForTimeout(500);
  const menuClosed = (await menu.count()) === 0;
  const triggerShowsFolder = (await page.getByRole("button", { name: firstFolderName }).count()) === 1;
  const rowsFiltered = await names();
  // rows whose folder is NOT the selected folder must be gone (seeded rows use folder "Folder name")
  const nonMatchingGone = !rowsFiltered.includes("ProfitPulse") && !rowsFiltered.includes("MarketMetrics");
  // clear: click trigger (now labelled with folder) + same folder again
  await page.getByRole("button", { name: firstFolderName }).first().click();
  await page.waitForTimeout(400);
  await page.locator('div[class*="w-[350px]"] button:has(img[src="/icons/ui/folder-menu.svg"])').first().click();
  await page.waitForTimeout(500);
  const rowsRestored = await names();
  const ok =
    menuOpen && countFiltered !== countBefore && countCleared === countBefore &&
    menuClosed && triggerShowsFolder && nonMatchingGone && rowsRestored.length === 7;
  if (ok)
    pass("folder-filter", `menu opened (${countBefore} folders), search "New" -> ${countFiltered}, cleared -> ${countCleared}; picked "${firstFolderName}" -> menu closed, trigger relabelled, table -> ${rowsFiltered.length} rows (non-matching gone); re-pick cleared -> ${rowsRestored.length} rows`);
  else
    fail("folder-filter", `menuOpen=${menuOpen}, folders ${countBefore}->${countFiltered} (search) ->${countCleared} (cleared), menuClosed=${menuClosed}, triggerShowsFolder=${triggerShowsFolder}, filtered rows=[${rowsFiltered.join(", ")}], restored=${rowsRestored.length}`);
} catch (e) {
  fail("folder-filter", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 4. create-tag ----------
try {
  const allBefore = (await tabInfo())["All"];
  await page.getByRole("button", { name: "Create Virtual Tag" }).click();
  await page.waitForTimeout(400);
  const item = page.getByText("New Virtual Tag", { exact: true });
  const itemVisible = await item.isVisible();
  await item.click();
  await page.waitForTimeout(400);
  const toastVisible = await page.getByText("Virtual tag created", { exact: true }).isVisible().catch(() => false);
  const rows = await names();
  const allAfter = (await tabInfo())["All"];
  if (itemVisible && toastVisible && rows.includes("NewVirtualTag-1") && allAfter === allBefore + 1)
    pass("create-tag", `dropdown showed "New Virtual Tag"; toast "Virtual tag created"; row NewVirtualTag-1 present; All counter ${allBefore} -> ${allAfter}`);
  else
    fail("create-tag", `itemVisible=${itemVisible}, toast=${toastVisible}, NewVirtualTag-1 ${rows.includes("NewVirtualTag-1") ? "present" : "absent"}, All ${allBefore} -> ${allAfter}`);
} catch (e) {
  fail("create-tag", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 5. new-folder ----------
try {
  await page.waitForTimeout(4200); // let earlier toasts expire so we assert the fresh one
  await page.getByRole("button", { name: "Create Virtual Tag" }).click();
  await page.waitForTimeout(400);
  await page.getByText("New Folder", { exact: true }).click();
  await page.waitForTimeout(400);
  const toastVisible = await page.getByText("Folder created", { exact: true }).isVisible().catch(() => false);
  if (toastVisible) pass("new-folder", `toast "Folder created" shown after Create dropdown > New Folder`);
  else fail("new-folder", `toast "Folder created" not visible after clicking New Folder`);
} catch (e) {
  fail("new-folder", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 6. rename ----------
try {
  const before = await names();
  const kebab = page.locator('button:has(img[src="/icons/ui/ellipsis-vertical.svg"])');
  await kebab.first().click();
  await page.waitForTimeout(400);
  await page.getByText("Rename", { exact: true }).click();
  await page.waitForTimeout(400);
  const input = page.locator('div[class*="min-w-[160px]"] input');
  const inputAppeared = (await input.count()) === 1;
  await input.fill("RenamedTag");
  await input.press("Enter");
  await page.waitForTimeout(500);
  const after = await names();
  if (inputAppeared && after[0] === "RenamedTag")
    pass("rename", `"${before[0]}" -> inline input appeared -> first cell now "RenamedTag"`);
  else
    fail("rename", `inputAppeared=${inputAppeared}, first row after rename = "${after[0]}" (was "${before[0]}")`);
} catch (e) {
  fail("rename", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 7. delete-undo ----------
try {
  await page.waitForTimeout(4200); // clear lingering toasts
  const before = await names();
  const target = before[0];
  await page.locator('button:has(img[src="/icons/ui/ellipsis-vertical.svg"])').first().click();
  await page.waitForTimeout(400);
  await page.getByText("Delete", { exact: true }).click();
  await page.waitForTimeout(400);
  const afterDelete = await names();
  const rowGone = !afterDelete.includes(target) && afterDelete.length === before.length - 1;
  const undoBtn = page.getByText("Undo", { exact: true });
  const toastHasUndo = await undoBtn.isVisible().catch(() => false);
  await undoBtn.click();
  await page.waitForTimeout(500);
  const afterUndo = await names();
  const rowBack = afterUndo.includes(target) && afterUndo.length === before.length;
  if (rowGone && toastHasUndo && rowBack)
    pass("delete-undo", `"${target}" deleted (${before.length} -> ${afterDelete.length} rows), toast with Undo shown; Undo -> row back (${afterUndo.length} rows)`);
  else
    fail("delete-undo", `rowGone=${rowGone} (${before.length} -> ${afterDelete.length}), undoVisible=${toastHasUndo}, rowBack=${rowBack} (${afterUndo.length})`);
} catch (e) {
  fail("delete-undo", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 8. sort-modified ----------
try {
  const before = await modifiedDates();
  await page.getByText("Modified date", { exact: true }).click();
  await page.waitForTimeout(500);
  const after = await modifiedDates();
  if (before && after && before[0] !== after[0])
    pass("sort-modified", `first row modified date changed "${before[0]}" -> "${after[0]}" after header click`);
  else
    fail("sort-modified", `first row modified date before="${before?.[0]}", after="${after?.[0]}" (unchanged)`);
} catch (e) {
  fail("sort-modified", `error: ${e.message.split("\n")[0]}`);
}

// ---------- 9. persist ----------
try {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.goto(`${BASE}/virtual-tags`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const rows = await names();
  if (rows.includes("NewVirtualTag-1"))
    pass("persist", `after navigating to / and back, NewVirtualTag-1 still present (${rows.length} rows)`);
  else
    fail("persist", `NewVirtualTag-1 absent after navigation; rows=[${rows.join(", ")}]`);
} catch (e) {
  fail("persist", `error: ${e.message.split("\n")[0]}`);
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
