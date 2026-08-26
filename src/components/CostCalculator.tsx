"use client";

import { useMemo, useState } from "react";
import { ARMS } from "@/data/arms";
import { computeCost, DEFAULT_INPUTS } from "@/lib/tco";
import type { CostInputs } from "@/lib/tco";
import { SourceLink } from "./Primitives";
import { S } from "@/data/sources";

export function CostCalculator() {
  const [i, setI] = useState<CostInputs>(DEFAULT_INPUTS);
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      ARMS.map((a) => computeCost(a, i))
        .filter((r) => r.total !== null)
        .sort((a, b) => (a.total ?? 0) - (b.total ?? 0)),
    [i]
  );
  const max = Math.max(...rows.map((r) => r.total ?? 0), 1);
  const totalMiles = i.milesPerYear * i.years;

  const set = <K extends keyof CostInputs,>(k: K, v: CostInputs[K]) => setI((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <div className="card mb-3 grid gap-x-8 gap-y-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Slider label="Miles per year" value={i.milesPerYear} min={4000} max={30000} step={1000} onChange={(v) => set("milesPerYear", v)} fmt={(v) => v.toLocaleString()} />
        <Slider label="Years you keep it" value={i.years} min={1} max={12} step={1} onChange={(v) => set("years", v)} fmt={(v) => `${v}`} />
        <Slider label="Shop labor rate" value={i.laborRate} min={80} max={260} step={5} onChange={(v) => set("laborRate", v)} fmt={(v) => `$${v}/hr`} />
        <Slider label="Alignment" value={i.alignment} min={60} max={300} step={10} onChange={(v) => set("alignment", v)} fmt={(v) => `$${v}`} />
        <Slider
          label="Joint life, your call"
          value={i.jointLifeMi}
          min={20000}
          max={120000}
          step={5000}
          onChange={(v) => set("jointLifeMi", v)}
          fmt={(v) => `${(v / 1000).toFixed(0)}k mi`}
        />
        <div>
          <div className="eyebrow mb-2">Who does the work</div>
          <div className="flex gap-1.5">
            {[
              { v: false, l: "Shop" },
              { v: true, l: "You do" },
            ].map((o) => (
              <button
                key={o.l}
                onClick={() => set("diy", o.v)}
                className={`num rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[0.09em] ${
                  i.diy === o.v ? "border-accent bg-accent text-accent-ink" : "border-rule text-ink-2 hover:text-ink"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-sm border-l-2 border-l-accent bg-surface p-3.5 text-[13px] leading-relaxed text-ink-2">
        <span className="font-medium text-ink">The joint life slider is an assumption, not a spec.</span> No manufacturer
        publishes how long the wear parts last. SPC is the only arm here with any documented evidence: their own warranty caps
        ball joints and bushings at 3 years or 36,000 miles and excludes off-road use, and owner failure reports cluster
        between 20,000 and 40,000 miles. Set the slider to whatever you actually believe and watch the order change.
        <div className="mt-1.5"><SourceLink s={S.spcWarranty} /></div>
      </div>

      <div className="card p-4 sm:p-5">
        <div className="eyebrow mb-4">
          {totalMiles.toLocaleString()} miles over {i.years} {i.years === 1 ? "year" : "years"} · purchase, grease, joints, alignments
        </div>
        <div className="space-y-2">
          {rows.map((r) => {
            const open = openId === r.arm.id;
            const seg = [
              { v: r.purchase ?? 0, c: "var(--c1)", l: "purchase" },
              { v: r.greaseCost, c: "var(--c4)", l: "grease" },
              { v: r.jointCost, c: "var(--c2)", l: "joints" },
              { v: (r.alignmentCost || 0) + i.alignment, c: "var(--c3)", l: "alignment" },
            ].filter((s) => s.v > 0);
            return (
              <div key={r.arm.id}>
                <button
                  onClick={() => setOpenId(open ? null : r.arm.id)}
                  aria-expanded={open}
                  className="grid w-full grid-cols-[minmax(100px,140px)_1fr_88px] items-center gap-3 text-left sm:grid-cols-[210px_1fr_100px]"
                >
                  <span className="truncate text-[12px] sm:text-[13px]">
                    <span className="font-medium">{r.arm.brand}</span>
                    <span className="hidden text-ink-2 sm:inline"> {r.arm.model}</span>
                  </span>
                  <span className="flex h-6 overflow-hidden bg-surface-2" style={{ width: `${((r.total ?? 0) / max) * 100}%`, minWidth: 24 }}>
                    {seg.map((s) => (
                      <span key={s.l} style={{ width: `${(s.v / (r.total ?? 1)) * 100}%`, background: s.c }} title={`${s.l}: $${Math.round(s.v).toLocaleString()}`} />
                    ))}
                  </span>
                  <span className="num flex items-baseline justify-end gap-1 text-right text-[13px] font-bold">
                    ${Math.round(r.total ?? 0).toLocaleString()}
                    {r.assumed.length > 1 && (
                      <span className="text-[11px] font-normal" style={{ color: "var(--warn)" }} title={`${r.assumed.length} assumptions behind this number`}>
                        △{r.assumed.length - 1}
                      </span>
                    )}
                  </span>
                </button>
                {open && (
                  <div className="mt-1.5 mb-2 rounded-sm bg-surface-2 p-3.5 text-[13px] leading-relaxed">
                    <div className="num grid gap-1 sm:grid-cols-2">
                      <span>Purchase: ${Math.round(r.purchase ?? 0).toLocaleString()}</span>
                      <span>Grease services: {r.greaseEvents} × = ${Math.round(r.greaseCost).toLocaleString()}</span>
                      <span>Joint replacements: {r.jointEvents} × = ${Math.round(r.jointCost).toLocaleString()}</span>
                      <span>Alignments: ${Math.round(r.alignmentCost + i.alignment).toLocaleString()}</span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-ink-2">
                      {r.assumed.map((a, k) => (
                        <li key={k} className="flex gap-2">
                          <span className="mt-[7px] h-[4px] w-[4px] shrink-0" style={{ background: "var(--warn)" }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {[
            ["purchase", "var(--c1)"],
            ["grease", "var(--c4)"],
            ["joints", "var(--c2)"],
            ["alignment", "var(--c3)"],
          ].map(([l, c]) => (
            <span key={l} className="eyebrow inline-flex items-center gap-1.5">
              <span className="h-2 w-2" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
        <p className="eyebrow mt-3 leading-relaxed">
          <span style={{ color: "var(--warn)" }}>△n</span> counts the unpublished numbers holding up that total. Open a row
          to read them. Dobinsons UCA59-203K is excluded because no US price could be sourced.
        </p>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="eyebrow flex items-baseline justify-between">
        {label}
        <span className="num text-[13px] text-ink">{fmt(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-1" />
    </label>
  );
}
