import { known, type Arm } from "@/data/types";

export interface CostInputs {
  /** Miles driven per year. */
  milesPerYear: number;
  /** How long you plan to keep the truck. */
  years: number;
  /** Shop labor rate, dollars per hour. */
  laborRate: number;
  /** Do the grease and joint work yourself. */
  diy: boolean;
  /** Cost of a front-end alignment. */
  alignment: number;
  /**
   * How long you assume the wear joints last before replacement.
   * This is YOUR assumption, not a manufacturer spec. Nobody publishes one.
   */
  jointLifeMi: number;
}

export const DEFAULT_INPUTS: CostInputs = {
  milesPerYear: 12000,
  years: 5,
  laborRate: 140,
  diy: false,
  alignment: 120,
  jointLifeMi: 60000,
};

/** Hours a shop books for each job. Round numbers, adjustable in one place. */
const HOURS = { grease: 0.4, jointSwap: 2.5 };

export interface CostBreakdown {
  arm: Arm;
  purchase: number | null;
  greaseCost: number;
  greaseEvents: number;
  jointCost: number;
  jointEvents: number;
  alignmentCost: number;
  total: number | null;
  /** True when a piece of this estimate rests on an unpublished number. */
  assumed: string[];
}

export function computeCost(arm: Arm, i: CostInputs): CostBreakdown {
  const totalMiles = i.milesPerYear * i.years;
  const assumed: string[] = [];

  const purchase = known(arm.price) ? arm.price.value : null;
  if (purchase === null) assumed.push("No US price could be sourced, so there is no total to show.");

  // Grease services
  let greaseEvents = 0;
  let greaseCost = 0;
  const mc = known(arm.maintenanceClass) ? arm.maintenanceClass.value : null;
  if (mc === "greaseable" || mc === "low") {
    const interval = known(arm.serviceIntervalMi) ? arm.serviceIntervalMi.value : mc === "greaseable" ? 3000 : 10000;
    if (!known(arm.serviceIntervalMi)) assumed.push(`No published grease interval. Assumed ${interval.toLocaleString()} miles.`);
    else if (arm.serviceIntervalMi.confidence === "estimate") assumed.push(`The ${interval.toLocaleString()}-mile interval comes from the thread analysis, not the manufacturer.`);
    greaseEvents = Math.floor(totalMiles / interval);
    greaseCost = i.diy ? greaseEvents * 4 : greaseEvents * HOURS.grease * i.laborRate;
  } else if (mc === null) {
    assumed.push("No published maintenance requirement, so nothing is budgeted here. That is a gap, not a zero.");
  }

  // Joint / bushing replacement
  let jointEvents = 0;
  let jointCost = 0;
  let alignmentCost = 0;
  if (mc !== "sealed") {
    jointEvents = Math.floor(totalMiles / i.jointLifeMi);
    if (jointEvents > 0) {
      const parts = known(arm.rebuildCost) ? arm.rebuildCost.value : null;
      if (parts === null) {
        assumed.push("No rebuild kit price published, so joint replacement is not costed.");
      } else {
        if (arm.rebuildCost.confidence === "estimate") assumed.push("Rebuild cost comes from the thread analysis, not a published parts price.");
        jointCost = jointEvents * (parts + (i.diy ? 0 : HOURS.jointSwap * i.laborRate));
        alignmentCost = jointEvents * i.alignment;
      }
    }
  }

  assumed.push(`Joint life set to ${i.jointLifeMi.toLocaleString()} miles. No manufacturer publishes one, so this slider is your call.`);

  const total = purchase === null ? null : purchase + greaseCost + jointCost + alignmentCost + i.alignment;

  return { arm, purchase, greaseCost, greaseEvents, jointCost, jointEvents, alignmentCost, total, assumed };
}
