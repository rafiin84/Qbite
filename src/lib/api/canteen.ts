import type { Canteen, Institution } from "@/types";
import { wait } from "@/lib/mock/latency";
import { mockDb, staticData } from "@/lib/mock/db";
import { simulateFlakeOnce } from "./errors";

export interface CanteenSnapshot {
  institution: Institution;
  canteen: Canteen;
}

export async function fetchCanteen(): Promise<CanteenSnapshot> {
  await wait(250, 500);
  simulateFlakeOnce("canteen", "We couldn't load the canteen status.");
  return {
    institution: staticData.institution,
    canteen: { ...staticData.canteen, status: mockDb.canteenStatus },
  };
}

/** Demo-only affordance so both the open and closed/pre-order flows can be reviewed on demand. */
export async function setCanteenStatusDemo(status: "open" | "closed"): Promise<void> {
  await wait(150, 300);
  mockDb.setCanteenStatus(status);
}
