import { usd } from "./data";

/*
 * SavingsCell — INVENT (proposed back to the DS).
 *
 * Projected and realized belong in one cell because the third outcome is not a
 * number: a Done item with no computable baseline is "Not verifiable", and
 * showing $0 there would claim a saving failed when we simply cannot tell.
 * The verdict is carried by a word, not by colour alone — colour only
 * reinforces it (WCAG AA: never colour as the sole channel).
 */

type Props = {
  projected: number;
  /** null while open; null on a Done row means no computable baseline */
  realized: number | null;
  status: "New" | "Working on it" | "Done" | "Dismissed";
  regressed?: boolean;
  /** Done, but still inside the 14-day comparison window */
  verifying?: boolean;
  daysLeft?: number;
};

export function SavingsCell({ projected, realized, status, regressed, verifying, daysLeft = 0 }: Props) {
  let verdict: string;
  let tone: string;

  if (regressed) {
    verdict = "Saving lost";
    tone = "text-red-800";
  } else if (verifying) {
    verdict = daysLeft > 0 ? `Verifying — ${daysLeft} days to go` : "Verifying";
    tone = "text-text-secondary";
  } else if (status === "Done" && realized === null) {
    verdict = "Not verifiable";
    tone = "text-text-tertiary";
  } else if (status === "Done" && realized !== null) {
    const delta = realized - projected;
    const sign = delta >= 0 ? "+" : "\u2212";
    verdict = "Realized " + usd(realized) + " (" + sign + usd(Math.abs(delta)) + ")";
    tone = "text-success-700";
  } else if (status === "Dismissed") {
    verdict = "Not pursued";
    tone = "text-text-tertiary";
  } else {
    // Open rows say nothing here — the Status column already says New / Working on it.
    // Repeating "Not yet verified" on every open row is noise, not information.
    verdict = "";
    tone = "";
  }

  return (
    <div className="flex flex-col justify-center gap-[2px] py-[6px]">
      <p className="font-sans font-medium leading-[22px] text-[16px] text-text-primary whitespace-nowrap">
        {usd(projected)} <span className="font-normal text-text-tertiary">/mo projected</span>
      </p>
      {verdict && (
        <p className={`font-sans font-normal leading-[18px] text-[13px] whitespace-nowrap ${tone}`}>{verdict}</p>
      )}
    </div>
  );
}
