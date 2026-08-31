/**
 * Sourcing model.
 *
 * Every number in this app is wrapped in a Fact so the UI can show where it
 * came from and how much to trust it. There is no unsourced number in the
 * dataset. Where nothing could be sourced, the field is a Gap, and the app
 * shows it as a gap rather than filling it with a plausible guess.
 */

export type Confidence =
  | "manufacturer" // published by the company that makes the part
  | "retailer"     // a seller's listing
  | "community"    // forum reports, independent reviews, tuner write-ups
  | "estimate"     // N64_Wallmaster's original analysis, not independently sourced
  | "gap";         // nobody publishes this

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  manufacturer: "Manufacturer published",
  retailer: "Retailer listing",
  community: "Community / third-party",
  estimate: "Thread analysis, unverified",
  gap: "No published spec",
};

export const CONFIDENCE_RANK: Record<Confidence, number> = {
  manufacturer: 4,
  retailer: 3,
  community: 2,
  estimate: 1,
  gap: 0,
};

export interface Source {
  label: string;
  url: string;
  quote?: string;
}

export interface Fact<T> {
  value: T;
  confidence: Confidence;
  sources: Source[];
  note?: string;
}

export interface Gap {
  value: null;
  confidence: "gap";
  sources: Source[];
  note?: string;
  /** What would close this gap. Shown in the "help fill this in" list. */
  needed?: string;
}

export type Maybe<T> = Fact<T> | Gap;

export function known<T>(f: Maybe<T> | undefined): f is Fact<T> {
  return !!f && f.value !== null && f.confidence !== "gap";
}

export type MaintenanceClass = "sealed" | "low" | "greaseable";
export type JointFamily = "ball-joint" | "uniball" | "flex-joint" | "delta-joint";
export type MaterialClass = "steel" | "chromoly" | "aluminum";

/**
 * The frame-side pivot, where the arm bolts to the chassis. A different part from
 * jointFamily, which is the joint at the knuckle. This is the one that decides how much
 * of the road you hear, and it wears and gets replaced on its own schedule.
 *
 * Nobody publishes an NVH measurement for any arm in this comparison, so this field
 * records what the pivot is and stops there. It is a gap unless a source names the type.
 */
export type PivotFamily =
  | "rubber"        // bonded rubber or synthetic elastomer, OE style
  | "poly"          // polyurethane, usually with a zerk
  | "sealed-pivot"  // sealed self-lubricating cartridge: GIIRO, SilentSpin
  | "flex-joint"    // SPC xAxis and equivalents
  | "spherical";    // uniball or rod end at the frame end

export const PIVOT_LABEL: Record<PivotFamily, string> = {
  rubber: "Rubber",
  poly: "Polyurethane",
  "sealed-pivot": "Sealed pivot",
  "flex-joint": "Flex joint",
  spherical: "Spherical",
};

export interface Arm {
  id: string;
  brand: string;
  model: string;
  partNumber: Maybe<string>;
  /** Short line shown on the card. Plain language, no marketing. */
  blurb: string;

  price: Maybe<number>;
  priceRetailer?: string;
  msrp?: Maybe<number>;

  material: Fact<string>;
  materialClass: MaterialClass;

  jointName: Fact<string>;
  jointFamily: JointFamily;

  /** Frame-side pivot: what it is called, and who says so. */
  framePivotName: Maybe<string>;
  /** Frame-side pivot type, for filtering and comparison. Never inferred from the brand. */
  framePivotFamily: Maybe<PivotFamily>;

  /** Degrees of caster the arm adds, or the range if adjustable. */
  casterDeg: Maybe<[number, number]>;
  casterAdjustable: Fact<boolean>;
  casterMechanism: Maybe<string>;

  /** Max ball joint articulation, degrees. */
  articulationDeg: Maybe<number>;

  /** Weight per pair, lbs. Stock 3rd gen pair is the STOCK_WEIGHT_LB baseline. */
  weightLbPair: Maybe<number>;

  maintenanceClass: Maybe<MaintenanceClass>;
  serviceIntervalMi: Maybe<number>;

  /** Cost to rebuild the wear parts once, in dollars. */
  rebuildCost: Maybe<number>;
  rebuildNote?: string;

  warranty: Maybe<string>;

  liftRangeIn: Maybe<[number, number]>;

  /** Independent owner evidence, good or bad. */
  fieldReports: {
    tone: "concern" | "praise" | "mixed";
    text: string;
    sources: Source[];
  }[];

  /** Everything the app could not source for this arm. */
  gaps: string[];
}
