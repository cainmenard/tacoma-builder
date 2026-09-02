"use client";

import { useState } from "react";
import { ARMS, STOCK_WEIGHT_LB } from "@/data/arms";
import { known } from "@/data/types";
import type { Arm, Confidence } from "@/data/types";
import { ConfidenceMeter } from "./Primitives";
import { money } from "@/lib/format";

type Metric = "caster" | "articulation" | "weight" | "price";

/** Bars are colored by how well sourced the number is, not by row order. */
const BAR_COLOR: Record<Confidence, string> = {
  "independent-test": "var(--c3)",
  manufacturer: "var(--c1)",
  retailer: "var(--c6)",
  community: "var(--c4)",
  estimate: "var(--c5)",
  gap: "var(--rule)",
};

const METRICS: { key: Metric; label: string; unit: string; note: string; higherIsBetter: boolean }[] = [
  {
    key: "caster",
    label: "Caster correction",
    unit: "°",
    note: "The thread asked for this first, and it is the emptiest column on the board.",
    higherIsBetter: true,
  },
  {
    key: "articulation",
    label: "Ball joint articulation",
    unit: "°",
    note: "Every figure here traces to the original thread analysis, not to a manufacturer spec. Read the meters.",
    higherIsBetter: true,
  },
  {
    key: "weight",
    label: "Weight per pair",
    unit: " lb",
    note: `Stock pair is the ${STOCK_WEIGHT_LB} lb baseline. Roughly every 10 lb of unsprung weight costs about 1% in fuel economy.`,
    higherIsBetter: false,
  },
  {
    key: "price",
    label: "Purchase price",
    unit: "",
    note: "Street prices pulled August 2026. This is the number before anything wears out.",
    higherIsBetter: false,
  },
];

function valueOf(arm: Arm, m: Metric): { v: number | null; c: Confidence; display: string } {
  if (m === "caster") {
    if (!known(arm.casterDeg)) return { v: null, c: "gap", display: "no published spec" };
    const [lo, hi] = arm.casterDeg.value;
    return { v: hi, c: arm.casterDeg.confidence, display: lo === hi ? `${hi}°` : `${lo}–${hi}°` };
  }
  if (m === "articulation") {
    if (!known(arm.articulationDeg)) return { v: null, c: "gap", display: "no published spec" };
    return { v: arm.articulationDeg.value, c: arm.articulationDeg.confidence, display: `${arm.articulationDeg.value}°` };
  }
  if (m === "weight") {
    if (!known(arm.weightLbPair)) return { v: null, c: "gap", display: "no published spec" };
    const v = arm.weightLbPair.value;
    const d = v - STOCK_WEIGHT_LB;
    return { v, c: arm.weightLbPair.confidence, display: `${v} lb  ${d >= 0 ? "+" : ""}${d.toFixed(1)} vs stock` };
  }
  if (!known(arm.price)) return { v: null, c: "gap", display: "no US price" };
  return { v: arm.price.value, c: arm.price.confidence, display: money(arm.price.value) };
}

export function MetricBoard() {
  const [metric, setMetric] = useState<Metric>("caster");
  const meta = METRICS.find((m) => m.key === metric)!;

  const rows = ARMS.map((arm) => ({ arm, ...valueOf(arm, metric) })).sort((a, b) => {
    if (a.v === null && b.v === null) return 0;
    if (a.v === null) return 1;
    if (b.v === null) return -1;
    return meta.higherIsBetter ? b.v - a.v : a.v - b.v;
  });

  const max = Math.max(...rows.map((r) => r.v ?? 0), 1);
  const gapCount = rows.filter((r) => r.v === null).length;

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-1.5" role="tablist" aria-label="Metric">
        {METRICS.map((m) => (
          <button
            key={m.key}
            role="tab"
            aria-selected={metric === m.key}
            onClick={() => setMetric(m.key)}
            className={`num rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
              metric === m.key
                ? "border-accent bg-accent text-accent-ink"
                : "border-rule text-ink-2 hover:border-rule-strong hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="mb-5 max-w-[62ch] text-[14px] leading-relaxed text-ink-2">
        {meta.note}
        {gapCount > 0 && (
          <span className="ml-1 text-ink-3">
            {gapCount} of {rows.length} arms have nothing published for this.
          </span>
        )}
      </p>

      <div className="space-y-1.5">
        {rows.map(({ arm, v, c, display }, i) => (
          <div key={arm.id} className="group grid grid-cols-[minmax(96px,140px)_1fr] items-center gap-3 sm:grid-cols-[180px_1fr]">
            <div className="truncate text-[12px] leading-tight text-ink-2 sm:text-[13px]">
              <span className="font-medium text-ink">{arm.brand}</span>
              <span className="hidden sm:inline"> {arm.model}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative h-6 flex-1 bg-surface-2">
                {v !== null ? (
                  <div
                    className="absolute inset-y-0 left-0 rise"
                    style={{
                      width: `${Math.max((v / max) * 100, 2)}%`,
                      background: BAR_COLOR[c],
                      animationDelay: `${i * 26}ms`,
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, var(--rule) 0 1px, transparent 1px 7px)",
                    }}
                  />
                )}
                {metric === "weight" && (
                  <div
                    className="absolute inset-y-0 w-px"
                    style={{ left: `${(STOCK_WEIGHT_LB / max) * 100}%`, background: "var(--ink)" }}
                    title="Stock pair"
                  />
                )}
              </div>
              <div className="num flex w-[164px] shrink-0 items-center gap-1.5 text-[11px] sm:w-[210px] sm:text-[12px]">
                <span className={v === null ? "text-ink-3 italic" : ""}>{display}</span>
                <ConfidenceMeter c={c} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-rule pt-3">
        {(
          [
            ["manufacturer", "manufacturer published"],
            ["retailer", "retailer listing"],
            ["community", "forum / third party"],
            ["estimate", "thread analysis, unverified"],
            ["gap", "nothing published"],
          ] as [Confidence, string][]
        ).map(([k, l]) => (
          <span key={k} className="eyebrow inline-flex items-center gap-1.5">
            <span className="h-2 w-4" style={{ background: BAR_COLOR[k] }} />
            {l}
          </span>
        ))}
      </div>
      {metric === "weight" && (
        <p className="eyebrow mt-2.5">Vertical rule marks the {STOCK_WEIGHT_LB} lb stock pair</p>
      )}
    </div>
  );
}
