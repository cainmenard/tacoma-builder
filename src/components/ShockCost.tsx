"use client";

import { useMemo, useState } from "react";
import { SHOCKS } from "@/data/shocks";
import { computeShockCost, DEFAULT_INPUTS } from "@/lib/tco";
import { money } from "@/lib/format";

/**
 * The rebuild clock, costed.
 *
 * The shock thread's own conclusion was that rebuild frequency, not sticker
 * price, decides what these actually cost. This shows both ends of every
 * published interval rather than picking one, because on the only shock with a
 * published interval that range is five to one and the honest answer is a bar,
 * not a number.
 */
export function ShockCost() {
  const [milesPerYear, setMilesPerYear] = useState(DEFAULT_INPUTS.milesPerYear);
  const [years, setYears] = useState(DEFAULT_INPUTS.years);
  const [diy, setDiy] = useState(false);

  const rows = useMemo(() => {
    const inputs = { ...DEFAULT_INPUTS, milesPerYear, years, diy };
    return SHOCKS.map((s) => computeShockCost(s, inputs)).sort((a, b) => {
      if (a.totalBest === null) return 1;
      if (b.totalBest === null) return -1;
      return a.totalBest - b.totalBest;
    });
  }, [milesPerYear, years, diy]);

  const max = Math.max(...rows.map((r) => r.totalWorst ?? 0), 1);
  const totalMiles = milesPerYear * years;

  return (
    <div>
      <div className="card mb-3 flex flex-wrap items-center gap-x-6 gap-y-3 p-3.5">
        <label className="flex min-w-[210px] flex-1 items-center gap-3 text-[13px]">
          <span className="eyebrow whitespace-nowrap">Miles / yr</span>
          <input type="range" min={3000} max={30000} step={1000} value={milesPerYear} onChange={(e) => setMilesPerYear(+e.target.value)} />
          <span className="num w-16 shrink-0 text-right">{milesPerYear.toLocaleString()}</span>
        </label>
        <label className="flex min-w-[170px] flex-1 items-center gap-3 text-[13px]">
          <span className="eyebrow whitespace-nowrap">Years</span>
          <input type="range" min={1} max={15} step={1} value={years} onChange={(e) => setYears(+e.target.value)} />
          <span className="num w-8 shrink-0 text-right">{years}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-[13px]">
          <input type="checkbox" checked={diy} onChange={(e) => setDiy(e.target.checked)} className="accent-[var(--accent)]" />
          I pull my own shocks
        </label>
        <span className="num text-[12px] text-ink-3">{totalMiles.toLocaleString()} miles</span>
      </div>

      <div className="card p-4">
        {rows.map((r) => {
          const spread = r.totalWorst !== null && r.totalBest !== null && r.totalWorst !== r.totalBest;
          return (
            <div key={r.shock.id} className="border-b border-rule py-3 last:border-0">
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[14px]">
                  <span className="font-medium">{r.shock.brand}</span>{" "}
                  <span className="text-ink-2">{r.shock.model}</span>
                </span>
                <span className="num text-[14px]">
                  {r.totalBest === null ? (
                    <span className="text-[13px] italic text-ink-3">no standalone price</span>
                  ) : spread ? (
                    <>
                      {money(r.totalBest)} <span className="text-ink-3">to</span> {money(r.totalWorst!)}
                    </>
                  ) : (
                    money(r.totalBest)
                  )}
                </span>
              </div>

              {r.totalBest !== null && (
                <div className="relative h-3 w-full bg-surface-2">
                  {/* Purchase price, then the rebuild range stacked on top of it. */}
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${((r.purchase ?? 0) / max) * 100}%`, background: "var(--c1)" }}
                  />
                  {spread && (
                    <div
                      className="absolute inset-y-0"
                      style={{
                        left: `${(r.totalBest / max) * 100}%`,
                        width: `${((r.totalWorst! - r.totalBest) / max) * 100}%`,
                        background: "color-mix(in srgb, var(--bad) 55%, transparent)",
                      }}
                    />
                  )}
                </div>
              )}

              <div className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">
                {r.purchase !== null && <>Purchase {money(r.purchase)}. </>}
                {r.rebuildsBest === r.rebuildsWorst
                  ? `${r.rebuildsWorst} rebuild${r.rebuildsWorst === 1 ? "" : "s"} over ${totalMiles.toLocaleString()} miles.`
                  : `${r.rebuildsBest} to ${r.rebuildsWorst} rebuilds over ${totalMiles.toLocaleString()} miles, depending where in the published range you land.`}
                {r.rebuildCostWorst > 0 && ` That is ${money(r.rebuildCostBest)} to ${money(r.rebuildCostWorst)} in rebuild cost.`}
              </div>

              {r.assumed.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {r.assumed.map((a) => (
                    <li key={a} className="flex gap-2 text-[12px] leading-snug text-ink-3">
                      <span className="mt-[6px] h-[4px] w-[4px] shrink-0" style={{ background: "var(--accent)" }} />
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="eyebrow mt-2 max-w-[70ch] leading-relaxed">
        Blue is what you pay once. Red is the rebuild range on top of it. Five of the six publish no rebuild interval at
        all, so their bars are purchase price and nothing else, which makes them look cheaper than they will be rather
        than more expensive.
      </p>
    </div>
  );
}
