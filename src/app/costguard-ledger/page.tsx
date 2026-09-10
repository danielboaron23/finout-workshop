import { Fira_Code, Fira_Sans } from "next/font/google";
import { CostGuardLedgerScreen } from "@/screens/CostGuardLedgerScreen";

/* Type is scoped to this route — the alternative direction does not inherit
 * the product's Helvetica Neue / Inter / Geist stack. */
const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--cg-mono" });
const firaSans = Fira_Sans({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--cg-sans" });

export default function CostGuardLedgerPage() {
  return (
    <div className={`${firaCode.variable} ${firaSans.variable} flex flex-1 h-full w-full`}>
      <CostGuardLedgerScreen />
    </div>
  );
}
