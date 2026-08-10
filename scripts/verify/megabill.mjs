/*
 * MegaBill page verifier — drives http://localhost:3000/megabill with playwright
 * and prints "PASS <name>" / "FAIL <name> :: <detail>" per check.
 */
import { chromium } from "playwright";

const results = [];
function report(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(pass ? `PASS ${name}` : `FAIL ${name} :: ${detail}`);
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();
page.setDefaultTimeout(5000);

await page.goto("http://localhost:3000/megabill", { waitUntil: "networkidle" });
await page.waitForSelector("section");
await page.waitForTimeout(600);

/* ---- shared locators ---- */
const barsLoc = page.locator("section .absolute.flex.items-end > div");
const segsLoc = page.locator("section .absolute.flex.items-end > div > div");
const xLabelsLoc = page.locator('section div[style*="padding-left"] p');
const tableRoot = page.locator('div[style*="min-width"]');
const panel = page.locator("div.z-50"); // the single open Dropdown panel
const firstBarH = async () => {
  const box = await barsLoc.first().boundingBox();
  return box ? box.height : 0;
};
const wait = (ms = 450) => page.waitForTimeout(ms);

/* ================= 1. legend-toggle ================= */
try {
  const seg0 = await segsLoc.count();
  const h0 = await firstBarH();
  const awsLegend = page.getByRole("button", { name: "AWS", exact: true });
  await awsLegend.click();
  await wait();
  const seg1 = await segsLoc.count();
  const h1 = await firstBarH();
  const opacity = await awsLegend.evaluate((el) => getComputedStyle(el).opacity);
  await awsLegend.click();
  await wait();
  const seg2 = await segsLoc.count();
  const h2 = await firstBarH();
  const pass = seg1 < seg0 && h1 < h0 && opacity === "0.4" && seg2 === seg0 && Math.abs(h2 - h0) < 2;
  report(
    "legend-toggle",
    pass,
    `segments ${seg0}->${seg1}->${seg2}, first bar ${h0.toFixed(1)}px->${h1.toFixed(1)}px->${h2.toFixed(1)}px, dimmed opacity=${opacity}`,
  );
} catch (e) {
  report("legend-toggle", false, e.message.split("\n")[0]);
}

/* ================= 2. unselect-all ================= */
try {
  const seg0 = await segsLoc.count();
  await page.getByText("Unselect all", { exact: true }).click();
  await wait();
  const segEmpty = await segsLoc.count();
  const selectAllShown = await page.getByText("Select all", { exact: true }).count();
  await page.getByText("Select all", { exact: true }).click();
  await wait();
  const segBack = await segsLoc.count();
  const pass = segEmpty === 0 && selectAllShown === 1 && segBack === seg0;
  report(
    "unselect-all",
    pass,
    `segments ${seg0}->${segEmpty} after Unselect all (link "Select all" x${selectAllShown}), restored to ${segBack}`,
  );
} catch (e) {
  report("unselect-all", false, e.message.split("\n")[0]);
}

/* ================= 3. cost-usage ================= */
try {
  await page.getByRole("button", { name: "Usage", exact: true }).click();
  await wait();
  const totalUsage = await page.getByText("Total Usage", { exact: true }).count();
  const tokensKpi = await page.getByText("10,4M Tokens", { exact: true }).count();
  const topY = (await page.locator("section p.text-right").first().textContent()) ?? "";
  await page.getByRole("button", { name: "Cost", exact: true }).click();
  await wait();
  const costBack = await page.getByText("$10,444,851", { exact: true }).count();
  const pass = totalUsage === 1 && tokensKpi === 1 && topY.includes("M") && costBack === 1;
  report(
    "cost-usage",
    pass,
    `Usage: "Total Usage" x${totalUsage}, "10,4M Tokens" x${tokensKpi}, y-top="${topY}"; Cost: "$10,444,851" x${costBack}`,
  );
} catch (e) {
  report("cost-usage", false, e.message.split("\n")[0]);
}

/* ================= 4. weekly ================= */
try {
  await page.getByRole("button", { name: "Daily", exact: true }).click();
  await panel.getByRole("button", { name: "Weekly", exact: true }).click();
  await wait();
  const weekBars = await barsLoc.count();
  const weekLabels = await xLabelsLoc.allTextContents();
  await page.getByRole("button", { name: "Weekly", exact: true }).click();
  await panel.getByRole("button", { name: "Daily", exact: true }).click();
  await wait();
  const dayBars = await barsLoc.count();
  const pass =
    weekBars === 4 && weekLabels.length === 4 && weekLabels.includes("Sep 17") && weekLabels.includes("Oct 08") && dayBars === 28;
  report("weekly", pass, `Weekly: ${weekBars} bars, labels [${weekLabels.join(", ")}]; back to Daily: ${dayBars} bars`);
} catch (e) {
  report("weekly", false, e.message.split("\n")[0]);
}

/* ================= 5. range ================= */
try {
  await page.getByRole("button", { name: "Last 30 Days", exact: true }).click();
  await panel.getByRole("button", { name: "Last 7 Days", exact: true }).click();
  await wait();
  const bars7 = await barsLoc.count();
  await page.getByRole("button", { name: "Last 7 Days", exact: true }).click();
  await panel.getByRole("button", { name: "Last 30 Days", exact: true }).click();
  await wait();
  const bars30 = await barsLoc.count();
  const pass = bars7 === 7 && bars30 === 28;
  report("range", pass, `Last 7 Days: ${bars7} bars; restored Last 30 Days: ${bars30} bars`);
} catch (e) {
  report("range", false, e.message.split("\n")[0]);
}

/* ================= 6. filters-chip ================= */
try {
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await panel.getByRole("menuitemcheckbox", { name: "AWS" }).click();
  await wait();
  const chip = await page.getByRole("button", { name: "Filters · 1", exact: true }).count();
  const awsRow = await tableRoot.getByText("AWS", { exact: true }).count();
  const awsLegend = await page.getByRole("button", { name: "AWS", exact: true }).count();
  const segs = await segsLoc.count();
  await panel.getByRole("menuitemcheckbox", { name: "AWS" }).click();
  await wait();
  await page.getByRole("button", { name: "Filters", exact: true }).click(); // close
  await wait();
  const awsRowBack = await tableRoot.getByText("AWS", { exact: true }).count();
  const segsBack = await segsLoc.count();
  const pass = chip === 1 && awsRow === 0 && awsLegend === 0 && segs === 196 && awsRowBack === 1 && segsBack === 224;
  report(
    "filters-chip",
    pass,
    `chip "Filters · 1" x${chip}, AWS table row x${awsRow}, AWS legend x${awsLegend}, segments ${segs}; restored row x${awsRowBack}, segments ${segsBack}`,
  );
} catch (e) {
  report("filters-chip", false, e.message.split("\n")[0]);
}

/* ================= 7. xaxis-service ================= */
try {
  await page.getByRole("button", { name: /X Axis/ }).click();
  await panel.getByRole("button", { name: "Service", exact: true }).click();
  await wait();
  const svcLabels = await xLabelsLoc.allTextContents();
  const svcBars = await barsLoc.count();
  await page.getByRole("button", { name: /X Axis/ }).click();
  await panel.getByRole("button", { name: "Date", exact: true }).click();
  await wait();
  const dateLabels = await xLabelsLoc.allTextContents();
  const pass = svcLabels.includes("Datadog") && svcBars === 10 && dateLabels.includes("Sep 17") && !dateLabels.includes("Datadog");
  report(
    "xaxis-service",
    pass,
    `Service pivot: ${svcBars} bars, labels include Datadog=${svcLabels.includes("Datadog")} [${svcLabels.slice(0, 4).join(", ")}...]; back to Date: first label "${dateLabels[0]}"`,
  );
} catch (e) {
  report("xaxis-service", false, e.message.split("\n")[0]);
}

/* ================= 8. amortized ================= */
try {
  await page.getByRole("button", { name: "Amortized Cost", exact: true }).click();
  await panel.getByRole("button", { name: "Net Cost", exact: true }).click();
  await wait();
  const netChip = await page.getByRole("button", { name: "Net Cost", exact: true }).count();
  const amortChip = await page.getByRole("button", { name: "Amortized Cost", exact: true }).count();
  await page.getByRole("button", { name: "Net Cost", exact: true }).click();
  await panel.getByRole("button", { name: "Amortized Cost", exact: true }).click();
  await wait();
  const amortBack = await page.getByRole("button", { name: "Amortized Cost", exact: true }).count();
  const pass = netChip === 1 && amortChip === 0 && amortBack === 1;
  report("amortized", pass, `after Net Cost: "Net Cost" chip x${netChip}, "Amortized Cost" chip x${amortChip}; restored x${amortBack}`);
} catch (e) {
  report("amortized", false, e.message.split("\n")[0]);
}

/* ================= 9. groupby-remove ================= */
try {
  const removeX = page.locator('span[aria-label="Remove Global Cost Center"]');
  await removeX.click();
  await wait();
  const removeBtnGone = await removeX.count();
  const tagTextGone = await page.getByText("Global Cost Center", { exact: true }).count();
  const totalSegs = await segsLoc.count();
  const awsLegend = await page.getByRole("button", { name: "AWS", exact: true }).count();
  await page.getByRole("button", { name: /Group By/ }).click();
  await panel.getByRole("button", { name: "Global Cost Center", exact: true }).click();
  await wait();
  const tagBack = await removeX.count();
  const segsBack = await segsLoc.count();
  const pass = removeBtnGone === 0 && tagTextGone === 0 && totalSegs === 28 && awsLegend === 0 && tagBack === 1 && segsBack === 224;
  report(
    "groupby-remove",
    pass,
    `tag removed: x-button x${removeBtnGone}, "Global Cost Center" text x${tagTextGone}, segments ${totalSegs} (single Total layer/bar), AWS legend x${awsLegend}; restored tag x${tagBack}, segments ${segsBack}`,
  );
} catch (e) {
  report("groupby-remove", false, e.message.split("\n")[0]);
}

/* ================= 10. save-view ================= */
try {
  const saveBtn = page.getByRole("button", { name: "Save", exact: true });
  const dimBefore = await saveBtn.evaluate((el) => el.className.includes("opacity-30"));
  await page.getByRole("button", { name: "Daily", exact: true }).click();
  await panel.getByRole("button", { name: "Weekly", exact: true }).click();
  await wait();
  const dimAfter = await saveBtn.evaluate((el) => el.className.includes("opacity-30"));
  await saveBtn.click();
  await page.getByText("View saved", { exact: true }).waitFor({ state: "visible", timeout: 2500 });
  await page.getByRole("button", { name: "View 1", exact: true }).click(); // Views trigger (relabeled)
  const listed = await panel.getByRole("button", { name: "View 1", exact: true }).count();
  await page.getByRole("button", { name: "View 1", exact: true }).first().click(); // close dropdown
  await wait();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByText("View cleared", { exact: true }).waitFor({ state: "visible", timeout: 2500 });
  await wait();
  const barsAfterClear = await barsLoc.count();
  await page.getByRole("button", { name: "Views", exact: true }).click();
  await panel.getByRole("button", { name: "View 1", exact: true }).click();
  await wait();
  const barsAfterApply = await barsLoc.count();
  // cleanup back to default
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await wait();
  const barsCleanup = await barsLoc.count();
  const pass =
    dimBefore && !dimAfter && listed === 1 && barsAfterClear === 28 && barsAfterApply === 4 && barsCleanup === 28;
  report(
    "save-view",
    pass,
    `Save dim before=${dimBefore} after change=${dimAfter}; toast "View saved" shown; "View 1" in Views x${listed}; Clear -> ${barsAfterClear} bars + "View cleared" toast; apply View 1 -> ${barsAfterApply} bars (weekly); cleanup -> ${barsCleanup}`,
  );
} catch (e) {
  report("save-view", false, e.message.split("\n")[0]);
}

/* ================= 11. funnel-filter ================= */
try {
  const funnel = page.locator('span[aria-label="Filter Name"]');
  await funnel.click();
  await panel.getByRole("menuitemcheckbox", { name: "AWS" }).click();
  await funnel.click(); // close
  await wait();
  const awsGone = await tableRoot.getByText("AWS", { exact: true }).count();
  await funnel.click();
  await panel.getByRole("menuitemcheckbox", { name: "AWS" }).click();
  await funnel.click(); // close
  await wait();
  const awsBack = await tableRoot.getByText("AWS", { exact: true }).count();
  const pass = awsGone === 0 && awsBack === 1;
  report("funnel-filter", pass, `AWS row after uncheck x${awsGone}, after recheck x${awsBack}`);
} catch (e) {
  report("funnel-filter", false, e.message.split("\n")[0]);
}

/* ================= 12. header-sort ================= */
try {
  const nameCol = tableRoot.locator("> div > div").first();
  const firstRowName = () => nameCol.locator("p").nth(1).textContent();
  const dots = page.locator('span[aria-label="Sort Percentage of total cost"]');
  await dots.click();
  await panel.getByRole("button", { name: "Sort descending", exact: true }).click();
  await wait();
  const descFirst = await firstRowName();
  const descPct = await tableRoot.locator("> div > div").last().locator("p").nth(1).textContent();
  await dots.click();
  await panel.getByRole("button", { name: "Sort ascending", exact: true }).click();
  await wait();
  const ascFirst = await firstRowName();
  const ascPct = await tableRoot.locator("> div > div").last().locator("p").nth(1).textContent();
  await dots.click();
  await panel.getByRole("button", { name: "Reset", exact: true }).click();
  await wait();
  const resetFirst = await firstRowName();
  const pass = descFirst === "AWS" && descPct === "56%" && ascFirst === "Untagged" && ascPct === "0.267%" && resetFirst === "AWS";
  report(
    "header-sort",
    pass,
    `desc first row "${descFirst}" (${descPct}), asc first row "${ascFirst}" (${ascPct}), reset first row "${resetFirst}"`,
  );
} catch (e) {
  report("header-sort", false, e.message.split("\n")[0]);
}

/* ================= 13. csv-download ================= */
try {
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 5000 }),
    page.getByRole("button", { name: "Download", exact: true }).first().click(),
  ]);
  const filename = download.suggestedFilename();
  report("csv-download", filename === "megabill.csv", `download event fired, filename "${filename}"`);
} catch (e) {
  report("csv-download", false, e.message.split("\n")[0]);
}

/* ================= 14. comment-badge ================= */
try {
  const badge = page.locator('div[class*="rounded-[40px]"] p');
  const before = (await badge.textContent()) ?? "";
  await page.getByRole("button", { name: "Comments", exact: true }).click();
  const input = page.getByPlaceholder("Add a comment");
  await input.fill("check this");
  await input.press("Enter");
  await wait();
  const after = (await badge.textContent()) ?? "";
  const pass = before === "0" && after === "1";
  report("comment-badge", pass, `badge "${before}" -> "${after}" after submitting "check this"`);
} catch (e) {
  report("comment-badge", false, e.message.split("\n")[0]);
}

/* ================= 15. line-mode ================= */
try {
  await page.getByRole("button", { name: "Line chart", exact: true }).click();
  await wait();
  const poly = await page.locator('svg[aria-label="Total line chart"] polyline').count();
  const barsInLineMode = await barsLoc.count();
  await page.getByRole("button", { name: "Bar chart", exact: true }).click();
  await wait();
  const polyAfter = await page.locator("svg polyline").count();
  const barsBack = await barsLoc.count();
  const pass = poly === 1 && barsInLineMode === 0 && polyAfter === 0 && barsBack === 28;
  report(
    "line-mode",
    pass,
    `line mode: polyline x${poly}, bars ${barsInLineMode}; bar mode: polyline x${polyAfter}, bars ${barsBack}`,
  );
} catch (e) {
  report("line-mode", false, e.message.split("\n")[0]);
}

await browser.close();
console.log("\nRESULTS_JSON " + JSON.stringify(results));
