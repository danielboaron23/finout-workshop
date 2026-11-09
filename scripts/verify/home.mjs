/*
 * Home dashboard verifier — http://localhost:3000/
 * Run from repo root: node scripts/verify/home.mjs
 * Prints one line per check: "PASS <name>" or "FAIL <name> :: <detail>"
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];

function report(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${pass ? " :: " + detail : " :: " + detail}`);
}

/** visible count of exact-text <p>/any element via getByText */
async function visCount(page, text) {
  const loc = page.getByText(text, { exact: true });
  const n = await loc.count();
  let vis = 0;
  for (let i = 0; i < n; i++) {
    if (await loc.nth(i).isVisible()) vis++;
  }
  return vis;
}

/** first data-row value + last-row value of a home-table column, by card title + header label */
async function readColumn(page, cardTitle, headerLabel) {
  return page.evaluate(
    ([cardTitle, headerLabel]) => {
      const titleP = [...document.querySelectorAll("p")].find(
        (p) => p.textContent.trim() === cardTitle,
      );
      if (!titleP) return { error: `card "${cardTitle}" not found` };
      let card = titleP;
      while (card && !(card.className || "").includes("drop-shadow")) card = card.parentElement;
      if (!card) return { error: "card root not found" };
      const headerP = [...card.querySelectorAll("p")].find(
        (p) => p.textContent.trim() === headerLabel,
      );
      if (!headerP) return { error: `header "${headerLabel}" not found` };
      // p -> flex wrapper -> header cell div; column = header cell's parent
      const headerCell = headerP.parentElement.parentElement;
      const col = headerCell.parentElement;
      const cells = [...col.children].slice(1).map((c) => c.textContent.trim());
      return { first: cells[0] ?? null, last: cells[cells.length - 1] ?? null, all: cells };
    },
    [cardTitle, headerLabel],
  );
}

/** chart card helpers: first cluster segment count/heights + AWS legend opacity */
async function chartState(page) {
  return page.evaluate(() => {
    const titleP = [...document.querySelectorAll("p")].find(
      (p) => p.textContent.trim() === "Monthly cost changes (year to date)",
    );
    if (!titleP) return { error: "chart card not found" };
    let card = titleP;
    while (card && !(card.className || "").includes("drop-shadow")) card = card.parentElement;
    const clusters = [...card.querySelectorAll("div.absolute.flex.flex-col")];
    const first = clusters[0] || null;
    const segs = first ? [...first.children] : [];
    const segInfo = segs.map((s) => ({
      color: getComputedStyle(s).backgroundColor,
      h: s.getBoundingClientRect().height,
    }));
    const rect = first ? first.getBoundingClientRect() : null;
    const legendAws = [...card.querySelectorAll("p")].find((p) => p.textContent.trim() === "AWS");
    const awsOpacity = legendAws ? Number(getComputedStyle(legendAws).opacity) : null;
    const yLabels = [...card.querySelectorAll("p")]
      .map((p) => p.textContent.trim())
      .filter((t) => /^-?\$?\d+%?$/.test(t));
    return {
      clusterCount: clusters.length,
      segCount: segs.length,
      segInfo,
      top: rect ? Math.round(rect.top) : null,
      height: rect ? Math.round(rect.height) : null,
      awsOpacity,
      yLabels,
    };
  });
}

const chartCard = (page) =>
  page
    .getByText("Monthly cost changes (year to date)", { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"drop-shadow")]');

const costCentersCard = (page) =>
  page
    .getByText("Monthly cost by cost centers", { exact: true })
    .locator('xpath=ancestor::div[contains(@class,"drop-shadow")]');

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  /* ---- 1. persona-engineer-hides ---- */
  try {
    // "0 Plans" count line is unique to the Financial Plans product card
    // (the sidebar also has a "Financial Plans" nav item that never hides)
    const beforeFP = await visCount(page, "0 Plans");
    await page.getByRole("button", { name: "Engineer" }).click();
    await page.waitForTimeout(500);
    const fp = await visCount(page, "0 Plans");
    const cta = await visCount(page, "Go to Financial Plans");
    const ts = await visCount(page, "Top monthly spend by service");
    const rec = await visCount(page, "Recent daily optimization recommendations");
    const pass = fp === 0 && cta === 0 && ts === 0 && rec === 1;
    report(
      "persona-engineer-hides",
      pass,
      `after Engineer: Financial Plans card ("0 Plans" visible=${fp}, was ${beforeFP}; CTA visible=${cta}), Top monthly spend visible=${ts}, Recommendations visible=${rec}`,
    );
  } catch (e) {
    report("persona-engineer-hides", false, e.message.split("\n")[0]);
  }

  /* ---- 2. persona-executive ---- */
  try {
    await page.getByRole("button", { name: "Executive" }).click();
    await page.waitForTimeout(500);
    const act = await visCount(page, "Recent activity");
    const rec = await visCount(page, "Recent daily optimization recommendations");
    report(
      "persona-executive",
      act === 1 && rec === 0,
      `after Executive: Recent activity visible=${act}, Recommendations visible=${rec}`,
    );
  } catch (e) {
    report("persona-executive", false, e.message.split("\n")[0]);
  }

  /* ---- 3. persona-persist ---- */
  try {
    await page.goto(BASE + "/virtual-tags", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const styles = await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button")].filter((b) =>
        ["FinOps", "Engineer", "Finance", "Executive"].includes(b.textContent.trim()),
      );
      return btns.map((b) => ({
        label: b.textContent.trim(),
        border: getComputedStyle(b).borderTopColor,
        bg: getComputedStyle(b).backgroundColor,
      }));
    });
    const exec = styles.find((s) => s.label === "Executive");
    const finops = styles.find((s) => s.label === "FinOps");
    const execActive =
      exec && exec.border === "rgb(21, 112, 239)" && exec.bg === "rgb(239, 248, 255)";
    const siblingsDiffer = finops && exec && finops.border !== exec.border;
    const rec = await visCount(page, "Recent daily optimization recommendations");
    report(
      "persona-persist",
      execActive && siblingsDiffer && rec === 0,
      `after /virtual-tags roundtrip: Executive border=${exec?.border} bg=${exec?.bg}, FinOps border=${finops?.border}, Recommendations visible=${rec}`,
    );
  } catch (e) {
    report("persona-persist", false, e.message.split("\n")[0]);
  }

  /* ---- 4. persona-back-finops ---- */
  try {
    await page.getByRole("button", { name: "FinOps" }).click();
    await page.waitForTimeout(500);
    const fp = await visCount(page, "0 Plans");
    const vt = await visCount(page, "50 Tags");
    const db = await visCount(page, "30 Dashboards");
    const cc = await visCount(page, "8 Cost Centers");
    const rec = await visCount(page, "Recent daily optimization recommendations");
    const ts = await visCount(page, "Top monthly spend by service");
    const act = await visCount(page, "Recent activity");
    report(
      "persona-back-finops",
      fp === 1 && vt === 1 && db === 1 && cc === 1 && rec === 1 && ts === 1 && act === 1,
      `after FinOps: product cards visible (Financial Plans=${fp}, Virtual Tags=${vt}, Dashboards=${db}, Cost Centers=${cc}), Recommendations=${rec}, Top spend=${ts}, Recent activity=${act}`,
    );
  } catch (e) {
    report("persona-back-finops", false, e.message.split("\n")[0]);
  }

  /* ---- 5. legend-toggle ---- */
  try {
    const before = await chartState(page);
    await chartCard(page).getByText("AWS", { exact: true }).click();
    await page.waitForTimeout(400);
    const after = await chartState(page);
    await chartCard(page).getByText("AWS", { exact: true }).click();
    await page.waitForTimeout(400);
    const restored = await chartState(page);
    const awsRgb = "rgb(152, 6, 206)"; // #9806ce
    const awsGoneFromFirst = !after.segInfo.some((s) => s.color === awsRgb);
    const pass =
      before.segCount === 8 &&
      after.segCount === before.segCount - 1 &&
      awsGoneFromFirst &&
      Math.abs(after.awsOpacity - 0.4) < 0.05 &&
      restored.segCount === 8 &&
      Math.abs(restored.awsOpacity - 1) < 0.05;
    report(
      "legend-toggle",
      pass,
      `first cluster segments ${before.segCount}(h=${before.height},top=${before.top}) -> ${after.segCount}(h=${after.height},top=${after.top}, AWS color present=${!awsGoneFromFirst}), legend opacity ${before.awsOpacity} -> ${after.awsOpacity} -> restored ${restored.segCount} segs, opacity ${restored.awsOpacity}`,
    );
  } catch (e) {
    report("legend-toggle", false, e.message.split("\n")[0]);
  }

  /* ---- 6. dollar-percent ---- */
  try {
    const card = chartCard(page);
    await card.getByRole("button", { name: "Switch to percentage view" }).click();
    await page.waitForTimeout(400);
    const pctState = await chartState(page);
    const has100pct = pctState.yLabels.includes("100%");
    const has100dollar = pctState.yLabels.includes("$100");
    await card.getByRole("button", { name: "Switch to absolute view" }).click();
    await page.waitForTimeout(400);
    const backState = await chartState(page);
    const backDollar = backState.yLabels.includes("$100");
    report(
      "dollar-percent",
      has100pct && !has100dollar && backDollar,
      `% mode labels=[${pctState.yLabels.join(",")}] (100%=${has100pct}, $100=${has100dollar}); after toggle back labels=[${backState.yLabels.join(",")}] ($100=${backDollar})`,
    );
  } catch (e) {
    report("dollar-percent", false, e.message.split("\n")[0]);
  }

  /* ---- 7. sort-costcenters ---- */
  try {
    // scope to the cost centers card — TopSpendCard also has a "Total Cost" header
    const totalCostHeader = costCentersCard(page).getByText("Total Cost", { exact: true });
    const before = await readColumn(page, "Monthly cost by cost centers", "Name");
    await totalCostHeader.click();
    await page.waitForTimeout(400);
    let after = await readColumn(page, "Monthly cost by cost centers", "Name");
    let clicks = 1;
    if (after.first === before.first) {
      // first click = desc and kubernetes is already max — toggle to asc
      await totalCostHeader.click();
      await page.waitForTimeout(400);
      after = await readColumn(page, "Monthly cost by cost centers", "Name");
      clicks = 2;
    }
    const pass =
      before.first === "kubernetes" && after.first !== before.first && after.last === "Total";
    report(
      "sort-costcenters",
      pass,
      `first row "${before.first}" -> "${after.first}" after ${clicks} click(s) on Total Cost; last row="${after.last}"`,
    );
  } catch (e) {
    report("sort-costcenters", false, e.message.split("\n")[0]);
  }

  /* ---- 8. goto-dashboard-nav ---- */
  try {
    await page.getByRole("button", { name: "Go to AWS dashboard" }).first().click();
    await page.waitForURL("**/megabill", { timeout: 5000 });
    const url = new URL(page.url()).pathname;
    await page.goBack();
    await page.waitForURL(BASE + "/", { timeout: 5000 });
    await page.waitForTimeout(700);
    report("goto-dashboard-nav", url === "/megabill", `navigated to ${url}, then back to ${new URL(page.url()).pathname}`);
  } catch (e) {
    report("goto-dashboard-nav", false, e.message.split("\n")[0]);
  }

  /* ---- 9. rec-sort ---- */
  try {
    const cardTitle = "Recent daily optimization recommendations";
    const before = await readColumn(page, cardTitle, "Scan Name");
    await page.getByText("Scanned Cost", { exact: true }).click();
    await page.waitForTimeout(400);
    let after = await readColumn(page, cardTitle, "Scan Name");
    let clicks = 1;
    if (after.first === before.first) {
      await page.getByText("Scanned Cost", { exact: true }).click();
      await page.waitForTimeout(400);
      after = await readColumn(page, cardTitle, "Scan Name");
      clicks = 2;
    }
    report(
      "rec-sort",
      !!before.first && after.first !== before.first,
      `first scan "${before.first}" -> "${after.first}" after ${clicks} click(s) on Scanned Cost`,
    );
  } catch (e) {
    report("rec-sort", false, e.message.split("\n")[0]);
  }

  /* ---- 10. go-to-scan-toast ---- */
  try {
    await page.getByRole("button", { name: "Go to scan" }).first().click();
    const toast = page.locator("text=CostGuard").first();
    await toast.waitFor({ state: "visible", timeout: 3000 });
    const text = (await toast.textContent()).trim();
    report("go-to-scan-toast", text.includes("CostGuard"), `toast appeared: "${text}"`);
    await page.waitForTimeout(4200); // let toast auto-dismiss before next check
  } catch (e) {
    report("go-to-scan-toast", false, `no toast containing "CostGuard" appeared :: ${e.message.split("\n")[0]}`);
  }

  /* ---- 11. share-link ---- */
  try {
    const share = page.getByText("Share Link", { exact: true });
    const n = await share.count();
    if (n === 0) {
      report(
        "share-link",
        false,
        'no "Share Link" element exists on the home page (home uses HomeTopBar with static images; the Share Link button lives in TopNav, used only on other pages)',
      );
    } else {
      await share.first().click();
      const toast = page
        .locator("div")
        .filter({ hasText: /^(Link copied|Couldn't copy link)$/ })
        .first();
      await toast.waitFor({ state: "visible", timeout: 3000 });
      const text = (await toast.textContent()).trim();
      report("share-link", true, `toast appeared: "${text}"`);
      await page.waitForTimeout(4200);
    }
  } catch (e) {
    report("share-link", false, e.message.split("\n")[0]);
  }

  /* ---- 12. product-cta-nav ---- */
  try {
    await page.getByRole("link", { name: "Go to Virtual Tags" }).click();
    await page.waitForURL("**/virtual-tags", { timeout: 5000 });
    report("product-cta-nav", new URL(page.url()).pathname === "/virtual-tags", `URL is now ${new URL(page.url()).pathname}`);
  } catch (e) {
    report("product-cta-nav", false, e.message.split("\n")[0]);
  }

  await browser.close();
  console.log("\nRESULTS_JSON " + JSON.stringify(results));
}

main().catch((e) => {
  console.error("FATAL", e);
  console.log("\nRESULTS_JSON " + JSON.stringify(results));
  process.exit(1);
});
