// Verifier for the Anomalies page (http://localhost:3000/anomalies + /anomalies/create).
// Run from repo root: node scripts/verify/anomalies.mjs
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];

function report(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(pass ? `PASS ${name}` : `FAIL ${name} :: ${detail}`);
}

async function check(name, fn) {
  try {
    const detail = await fn();
    report(name, true, detail ?? "ok");
  } catch (e) {
    report(name, false, String(e.message ?? e).split("\n")[0].slice(0, 300));
  }
}

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

const cardCount = () => page.getByRole("button", { name: "Investigate", exact: true }).count();
const resultText = async () => {
  const el = page.getByText(/^\d+ results?$/).first();
  return (await el.count()) ? (await el.textContent()).trim() : "(no result-count text)";
};
// Card root = ancestor div with p-[24px] of the exact title text.
const cardByTitle = (title) =>
  page.getByText(title, { exact: true }).locator('xpath=ancestor::div[contains(@class,"p-[24px]")][1]');

await page.goto(`${BASE}/anomalies`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// ---- 1. search ----
await check("search", async () => {
  const input = page.getByPlaceholder("Search Anomalies");
  await input.fill("zzz");
  await page.waitForTimeout(400);
  const afterType = await resultText();
  const cardsAfterType = await cardCount();
  if (afterType !== "0 results" || cardsAfterType !== 0)
    throw new Error(`after "zzz": count text "${afterType}", ${cardsAfterType} cards`);
  await input.fill("");
  await page.waitForTimeout(400);
  const afterClear = await resultText();
  if (afterClear !== "1 result") throw new Error(`after clear: count text "${afterClear}"`);
  return `zzz -> "0 results" + 0 cards; clear -> "1 result"`;
});

// ---- 2. chip-type ----
await check("chip-type", async () => {
  await page.getByRole("button", { name: "Type", exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Cost Anomaly", exact: true }).click();
  await page.waitForTimeout(400);
  const chip = page.getByRole("button", { name: /Type: .*Cost/ });
  if ((await chip.count()) === 0) throw new Error("chip label does not contain 'Cost' after selecting Cost Anomaly");
  const chipLabel = (await chip.first().textContent()).trim();
  const filtered = await resultText();
  const cards = await cardCount();
  if (filtered !== "0 results" || cards !== 0)
    throw new Error(`with Cost filter: count text "${filtered}", ${cards} cards`);
  // re-open and re-select to clear
  await chip.first().click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Cost Anomaly", exact: true }).click();
  await page.waitForTimeout(400);
  const cleared = await resultText();
  if (cleared !== "1 result") throw new Error(`after clearing type filter: "${cleared}"`);
  return `chip "${chipLabel}" + 0 results; cleared -> "1 result"`;
});

// ---- 3. chip-threshold ----
await check("chip-threshold", async () => {
  await page.getByRole("button", { name: "Anomaly Threshold", exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: ">5%", exact: true }).click();
  await page.waitForTimeout(400);
  const at5 = await resultText();
  const cardsAt5 = await cardCount();
  if (at5 !== "1 result" || cardsAt5 !== 1) throw new Error(`>5%: count text "${at5}", ${cardsAt5} cards`);
  await page.getByRole("button", { name: /Threshold: >5%/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: ">10%", exact: true }).click();
  await page.waitForTimeout(400);
  const at10 = await resultText();
  const cardsAt10 = await cardCount();
  if (at10 !== "0 results" || cardsAt10 !== 0) throw new Error(`>10%: count text "${at10}", ${cardsAt10} cards`);
  // clear: re-open and re-select ">10%"
  await page.getByRole("button", { name: /Threshold: >10%/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: ">10%", exact: true }).click();
  await page.waitForTimeout(400);
  const cleared = await resultText();
  if (cleared !== "1 result") throw new Error(`after clearing threshold: "${cleared}"`);
  return `>5% keeps 9% card (1 result); >10% -> 0 results; cleared -> "1 result"`;
});

// ---- 4. create-flow ----
await check("create-flow", async () => {
  await page.getByRole("link", { name: "Create Anomaly Alert" }).click();
  await page.waitForURL(/\/anomalies\/create$/);
  await page.waitForTimeout(500);
  // Usage Type drawer's select (shows "Anthropic Tokens" by default)
  await page.getByRole("button", { name: "Anthropic Tokens", exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "OpenAI Tokens", exact: true }).click();
  await page.waitForTimeout(300);
  const nameInput = page.getByLabel("Alert Name", { exact: true });
  await nameInput.fill("Verify Alert");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/\/anomalies$/);
  await page.waitForTimeout(500);
  const count = await resultText();
  if (count !== "2 results") throw new Error(`after save: count text "${count}"`);
  const card = cardByTitle("Verify Alert");
  if ((await card.count()) === 0) throw new Error('no card titled "Verify Alert"');
  const usageLine = card.getByText("OpenAI - Tokens", { exact: true });
  if ((await usageLine.count()) === 0) {
    const body = (await card.first().textContent()).slice(0, 200);
    throw new Error(`card usage type line missing "OpenAI - Tokens"; card text: ${body}`);
  }
  return `saved -> "2 results"; card "Verify Alert" with usage type "OpenAI - Tokens"`;
});

// ---- 5. manage-tab ----
await check("manage-tab", async () => {
  await page.getByRole("button", { name: "Manage Anomalies", exact: true }).click();
  await page.waitForTimeout(400);
  const verifyVisible = await page.getByText("Verify Alert", { exact: true }).count();
  const builtInVisible = await page.getByText("Anthropic Tokens", { exact: true }).count();
  const cards = await cardCount();
  if (verifyVisible !== 1 || builtInVisible !== 0 || cards !== 1)
    throw new Error(`manage tab: ${cards} cards, "Verify Alert" x${verifyVisible}, "Anthropic Tokens" x${builtInVisible}`);
  await page.getByRole("button", { name: "Anomalies Feed", exact: true }).click();
  await page.waitForTimeout(400);
  const feedVerify = await page.getByText("Verify Alert", { exact: true }).count();
  const feedBuiltIn = await page.getByText("Anthropic Tokens", { exact: true }).count();
  const feedCards = await cardCount();
  if (feedVerify !== 1 || feedBuiltIn !== 1 || feedCards !== 2)
    throw new Error(`feed tab: ${feedCards} cards, "Verify Alert" x${feedVerify}, "Anthropic Tokens" x${feedBuiltIn}`);
  return `manage: only "Verify Alert" (1 card); feed: both cards (2)`;
});

// ---- 6. edit-flow ----
await check("edit-flow", async () => {
  await cardByTitle("Verify Alert").getByRole("button", { name: "Edit anomaly", exact: true }).click();
  await page.waitForURL(/\/anomalies\/create\?edit=/);
  await page.waitForTimeout(500);
  const nameInput = page.getByLabel("Alert Name", { exact: true });
  const prefill = await nameInput.inputValue();
  if (prefill !== "Verify Alert") throw new Error(`Alert Name prefilled with "${prefill}"`);
  await nameInput.fill("Verify Alert Edited");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/\/anomalies$/);
  await page.waitForTimeout(500);
  const count = await resultText();
  const cards = await cardCount();
  const edited = await page.getByText("Verify Alert Edited", { exact: true }).count();
  const oldTitle = await page.getByText("Verify Alert", { exact: true }).count();
  if (count !== "2 results" || cards !== 2 || edited !== 1 || oldTitle !== 0)
    throw new Error(`after edit save: "${count}", ${cards} cards, edited x${edited}, old title x${oldTitle}`);
  return `prefill "Verify Alert"; saved -> "2 results", title now "Verify Alert Edited", no third card`;
});

// ---- 7. comment ----
await check("comment", async () => {
  const builtIn = cardByTitle("Anthropic Tokens");
  await builtIn.getByRole("button", { name: "Add comment", exact: true }).click();
  await page.waitForTimeout(300);
  const input = page.getByPlaceholder("Add a comment");
  if (!(await input.isVisible())) throw new Error("comment input did not appear");
  await input.fill("looks bad");
  await input.press("Enter");
  await page.waitForTimeout(500);
  const line = cardByTitle("Anthropic Tokens").getByText("You · just now · looks bad", { exact: true });
  if ((await line.count()) === 0) throw new Error('no line "You · just now · looks bad" on the card');
  return `comment line "You · just now · looks bad" shown on built-in card`;
});

// ---- 8. delete-undo ----
await check("delete-undo", async () => {
  await cardByTitle("Verify Alert Edited").getByRole("button", { name: "Delete", exact: true }).click();
  await page.waitForTimeout(400);
  const afterDelete = await resultText();
  const undo = page.getByRole("button", { name: "Undo", exact: true });
  const toastVisible = await page.getByText("Alert deleted", { exact: true }).count();
  if (afterDelete !== "1 result") throw new Error(`after delete: count text "${afterDelete}"`);
  if ((await undo.count()) === 0 || toastVisible === 0)
    throw new Error(`toast missing (Undo x${await undo.count()}, "Alert deleted" x${toastVisible})`);
  await undo.click();
  await page.waitForTimeout(500);
  const afterUndo = await resultText();
  if (afterUndo !== "2 results") throw new Error(`after undo: count text "${afterUndo}"`);
  return `delete -> "1 result" + "Alert deleted" toast with Undo; undo -> "2 results"`;
});

// ---- 9. jira-toast ----
await check("jira-toast", async () => {
  await page.getByRole("button", { name: "Create a Jira issue", exact: true }).first().click();
  await page.waitForTimeout(400);
  const toast = page.getByText(/FIN-1234/);
  if ((await toast.count()) === 0) throw new Error("no toast containing FIN-1234");
  return `toast "${(await toast.first().textContent()).trim()}"`;
});

// ---- 10. investigate-nav ----
await check("investigate-nav", async () => {
  await page.getByRole("button", { name: "Investigate", exact: true }).first().click();
  await page.waitForURL(/\/megabill/, { timeout: 10000 });
  return `navigated to ${page.url()}`;
});

await browser.close();
console.log("__RESULTS__" + JSON.stringify(results));
