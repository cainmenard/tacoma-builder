import { ARMS } from "@/data/arms";
import { known, type Arm } from "@/data/types";
import { money } from "./format";

export type LiftAnswer = "stock" | "two" | "three" | "lt";
export type UseAnswer = "street" | "mixed" | "trail";
export type BudgetAnswer = "under700" | "under1000" | "open";
export type WrenchAnswer = "never" | "sometimes" | "always";

export interface Answers {
  lift: LiftAnswer;
  use: UseAnswer;
  budget: BudgetAnswer;
  wrench: WrenchAnswer;
}

export const QUESTIONS = [
  {
    key: "lift" as const,
    eyebrow: "Front lift",
    prompt: "How much lift is the front end running?",
    help: "Caster loss is why most people end up buying arms at all. More lift, more correction needed.",
    options: [
      { value: "stock" as const, label: "Stock height", detail: "Replacing worn arms, not correcting a lift" },
      { value: "two" as const, label: "Up to 2 inches", detail: "The most common 3rd gen setup" },
      { value: "three" as const, label: "2 to 3 inches", detail: "Needs real caster correction" },
      { value: "lt" as const, label: "3 inches or more", detail: "Long travel territory" },
    ],
  },
  {
    key: "use" as const,
    eyebrow: "Duty cycle",
    prompt: "Where does the truck actually spend its miles?",
    help: "Warranty exclusions and joint wear both track this more than anything else.",
    options: [
      { value: "street" as const, label: "Mostly street", detail: "90% pavement, gravel roads on weekends" },
      { value: "mixed" as const, label: "Split", detail: "Overlanding, forest roads, some rough stuff" },
      { value: "trail" as const, label: "Mostly dirt", detail: "Real trail miles, washboard, whoops" },
    ],
  },
  {
    key: "budget" as const,
    eyebrow: "Budget",
    prompt: "What is the ceiling on the arms themselves?",
    help: "Purchase price only. The cost calculator further down handles what happens after.",
    options: [
      { value: "under700" as const, label: "Under $700", detail: "" },
      { value: "under1000" as const, label: "Under $1,000", detail: "" },
      { value: "open" as const, label: "Buy once, cry once", detail: "" },
    ],
  },
  {
    key: "wrench" as const,
    eyebrow: "Service",
    prompt: "Are you going to grease these yourself?",
    help: "A greaseable arm you never grease is a worse arm than a sealed one.",
    options: [
      { value: "never" as const, label: "No", detail: "It goes to a shop, or it gets ignored" },
      { value: "sometimes" as const, label: "If it is easy", detail: "A zerk fitting, sure. A press, no." },
      { value: "always" as const, label: "Yes", detail: "Grease gun is already on the bench" },
    ],
  },
];

export interface ScoreLine {
  label: string;
  points: number;
  reason: string;
}

export interface Scored {
  arm: Arm;
  total: number;
  lines: ScoreLine[];
  disqualified: string | null;
}

const LIFT_IN: Record<LiftAnswer, number> = { stock: 0, two: 2, three: 3, lt: 4 };

export function scoreArms(a: Answers): Scored[] {
  return ARMS.map((arm) => {
    const lines: ScoreLine[] = [];
    let disqualified: string | null = null;
    const price = known(arm.price) ? arm.price.value : null;
    const lift = LIFT_IN[a.lift];

    // --- Budget. A hard gate, because it is the one answer nobody wants softened.
    const cap = a.budget === "under700" ? 700 : a.budget === "under1000" ? 1000 : Infinity;
    if (price === null) {
      lines.push({ label: "Price", points: -6, reason: "No US price could be sourced, so this cannot be budgeted." });
    } else if (price > cap) {
      disqualified = `${money(price)} is over your ceiling`;
    } else if (cap !== Infinity) {
      const headroom = (cap - price) / cap;
      const pts = Math.round(headroom * 10);
      lines.push({ label: "Price", points: pts, reason: `${money(price)} leaves $${Math.round(cap - price).toLocaleString()} under your ceiling.` });
    } else {
      lines.push({ label: "Price", points: 0, reason: `${money(price)}, and you said price is not the constraint.` });
    }

    // --- Caster. The thread's number one request, so it carries real weight.
    if (known(arm.casterDeg)) {
      const [lo, hi] = arm.casterDeg.value;
      const adjustable = known(arm.casterAdjustable) && arm.casterAdjustable.value;
      const need = lift >= 3 ? 3 : lift >= 2 ? 2.5 : 0;
      if (hi >= need) {
        const conf =
          arm.casterDeg.confidence === "independent-test" ? 7
            : arm.casterDeg.confidence === "manufacturer" ? 6
              : arm.casterDeg.confidence === "retailer" ? 4
                : 3;
        lines.push({
          label: "Caster",
          points: conf,
          reason:
            lo === hi
              ? `${lo}° of correction, published. Enough for ${lift}" of lift.`
              : adjustable
                ? `${lo}° to ${hi}°, dialed at the rack. Covers ${lift}" of lift with room left.`
                : `Reported between ${lo}° and ${hi}°, fixed. Covers ${lift}" of lift.`,
        });
      } else {
        lines.push({ label: "Caster", points: -4, reason: `${hi}° is short of what ${lift}" of lift gives back.` });
      }
    } else {
      lines.push({
        label: "Caster",
        points: lift >= 2 ? -3 : -1,
        reason: "Nobody publishes a caster figure for this arm, so you are buying on faith.",
      });
    }

    if (known(arm.casterAdjustable) && arm.casterAdjustable.value) {
      lines.push({ label: "Adjustable", points: lift >= 3 ? 5 : 2, reason: "Caster can be dialed at the alignment rack instead of hoping the fixed offset lands." });
    }

    // --- Lift range fit.
    if (known(arm.liftRangeIn)) {
      const [, max] = arm.liftRangeIn.value;
      if (lift > max) {
        lines.push({ label: "Lift range", points: -5, reason: `Rated to ${max}", and you are at ${lift}".` });
      } else {
        lines.push({ label: "Lift range", points: 2, reason: `Rated to ${max}", which covers you.` });
      }
    }

    // --- Duty cycle vs joint family and maintenance. The knuckle joint and the frame-side
    // pivot are scored separately because they are separate parts, and an arm can be
    // spherical at one end and rubber at the other.
    const mc = known(arm.maintenanceClass) ? arm.maintenanceClass.value : null;
    const pivot = known(arm.framePivotFamily) ? arm.framePivotFamily.value : null;
    if (a.use === "trail") {
      if (arm.jointFamily === "uniball") lines.push({ label: "Trail duty", points: 5, reason: "Uniball construction is what trail miles ask for." });
      if (arm.jointFamily === "delta-joint") lines.push({ label: "Trail duty", points: 4, reason: "Delta Joint holds up to trail use without full race-part upkeep." });
      if (pivot === "spherical") lines.push({ label: "Frame pivot", points: 3, reason: "A spherical frame-side pivot takes articulation a bushing has to fight." });
      if (pivot === "flex-joint") lines.push({ label: "Frame pivot", points: 1, reason: "Flex joints at the frame end move further than rubber before anything binds." });
      if (arm.materialClass === "chromoly") lines.push({ label: "Material", points: 3, reason: "Chromoly for impact loads." });
    } else if (a.use === "street") {
      if (mc === "sealed") lines.push({ label: "Street duty", points: 5, reason: "Sealed joints and street miles are a good match. Nothing to forget." });
      if (arm.jointFamily === "uniball") lines.push({ label: "Street duty", points: -3, reason: "Uniballs transmit more noise and wear faster on pavement than a street truck needs." });
      if (pivot === "rubber") lines.push({ label: "Frame pivot", points: 4, reason: "Rubber at the frame end is the closest thing here to the way the truck left the factory." });
      if (pivot === "sealed-pivot") lines.push({ label: "Frame pivot", points: 2, reason: "A sealed frame-side pivot asks for nothing and does not need a grease gun to stay quiet." });
      if (pivot === "poly") lines.push({ label: "Frame pivot", points: -1, reason: "Polyurethane frame bushings want their zerks hit or they start talking back." });
      if (pivot === "spherical") lines.push({ label: "Frame pivot", points: -4, reason: "A rod end at the frame end is a metal path from the road into the cab." });
    } else {
      if (mc === "sealed") lines.push({ label: "Mixed duty", points: 3, reason: "Sealed joints survive neglect, which mixed-use trucks get plenty of." });
      if (arm.jointFamily === "delta-joint" || arm.jointFamily === "uniball") lines.push({ label: "Mixed duty", points: 2, reason: "Enough joint for the dirt half of the split." });
      if (pivot === "sealed-pivot") lines.push({ label: "Frame pivot", points: 2, reason: "Sealed at the frame end too, so there is nothing on the schedule at either end." });
    }

    // --- Willingness to service.
    if (mc === "greaseable") {
      if (a.wrench === "never") lines.push({ label: "Service", points: -7, reason: "This arm needs a grease gun on a schedule and you said that will not happen." });
      else if (a.wrench === "sometimes") lines.push({ label: "Service", points: -2, reason: "Greaseable. Manageable, but it is a recurring chore." });
      else lines.push({ label: "Service", points: 3, reason: "Greaseable, and you are the person who will actually do it." });
    } else if (mc === "sealed") {
      lines.push({ label: "Service", points: a.wrench === "never" ? 6 : 2, reason: "Sealed. There is nothing on the schedule." });
    } else if (mc === "low") {
      lines.push({ label: "Service", points: a.wrench === "never" ? 1 : 2, reason: "Light service. Manufacturer calls it maintenance-free." });
    } else {
      lines.push({ label: "Service", points: -2, reason: "No published maintenance requirement, which is not the same as no maintenance." });
    }

    // --- Documented durability concerns count against, regardless of duty cycle.
    const concerns = arm.fieldReports.filter((r) => r.tone === "concern").length;
    if (concerns) {
      lines.push({
        label: "Field reports",
        points: -3 * concerns,
        reason: `${concerns} documented ${concerns === 1 ? "concern" : "concerns"} from owners or conflicting manufacturer claims.`,
      });
    }
    const praise = arm.fieldReports.filter((r) => r.tone === "praise").length;
    if (praise) lines.push({ label: "Field reports", points: 2 * praise, reason: "Owners running these have reported back positively." });

    // --- How much of this arm's spec sheet is actually knowable.
    const gapPenalty = Math.min(arm.gaps.length, 8);
    lines.push({
      label: "Data quality",
      points: -gapPenalty,
      reason: `${arm.gaps.length} spec${arm.gaps.length === 1 ? "" : "s"} nobody publishes.`,
    });

    const total = lines.reduce((s, l) => s + l.points, 0);
    return { arm, total, lines, disqualified };
  })
    .sort((x, y) => y.total - x.total);
}

export function survivorCount(partial: Partial<Answers>): number {
  const budget = partial.budget;
  if (!budget) return ARMS.length;
  const cap = budget === "under700" ? 700 : budget === "under1000" ? 1000 : Infinity;
  return ARMS.filter((arm) => known(arm.price) && arm.price.value <= cap).length;
}
