/*
 * MegaBill — tiny browser-action helpers (no component imports, so both the
 * chart section and the table can use them without module cycles).
 */

/** Serialize text as a CSV file and trigger a browser download. */
export function downloadCsvFile(csv: string, filename = "megabill.csv") {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Copy text to the clipboard; resolves when written. */
export function copyText(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error("Clipboard unavailable"));
}
