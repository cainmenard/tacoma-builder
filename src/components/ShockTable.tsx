"use client";

import { useState } from "react";
import { SHOCKS } from "@/data/shocks";
import { known, ADJUSTER_LABEL, RESERVOIR_LABEL } from "@/data/types";
import type { Shock } from "@/data/types";
import { SourcedValue, SourceLink, ConfidenceMeter } from "./Primitives";
import { money } from "@/lib/format";

const TONE = {
  concern: { color: "var(--bad)", label: "Concern" },
  praise: { color: "var(--good)", label: "Owner report" },
  mixed: { color: "var(--warn)", label: "Unresolved" },
};

const miles = (v: [number, number]) =>
  v[0] === v[1] ? `${v[0].toLocaleString()}` : `${v[0].toLocaleString()}–${v[1].toLocaleString()}`;

/**
 * Shocks get a table rather than the arms' drawer, because the thing that
 * matters most here is a range (the rebuild clock) rather than a single figure,
 * and ranges read better side by side than one at a time.
 *
 * Price is deliberately not sortable. Half these listings are a front pair and
 * half are four corners, so a price column that sorted would be lying.
 */
export function ShockTable() {
  const [open, setOpen] = useState<string | null>(null);
  const [heavy, setHeavy] = useState(false);

  return (
    <div>
      {/* The thread's question: what happens when the front end is heavier than stock. */}
      <div className="card mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 p-3.5">
        <label className="flex cursor-pointer items-center gap-2 text-[13px]">
          <input type="checkbox" checked={heavy} onChange={(e) => setHeavy(e.target.checked)} className="accent-[var(--accent)]" />
          Heavy front end (bumper, winch, armor)
        </label>
        <span className="eyebrow text-ink-3">
          {heavy
            ? `${SHOCKS.filter((s) => known(s.springRatesLbIn)).length} of ${SHOCKS.length} publish a coil rate you can order. The rest is a phone call about a revalve.`
            : "Turn this on to see which of these publish a heavier coil option and which do not."}
        </span>
      </div>

      <div className="card scroll-x">
        <table className="w-full min-w-[900px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-rule-strong">
              <th className="px-3 py-2 text-left font-normal"><span className="eyebrow">Shock</span></th>
              <th className="px-3 py-2 text-right font-normal"><span className="eyebrow">Price</span></th>
              <th className="px-3 py-2 text-left font-normal"><span className="eyebrow">Covers</span></th>
              <th className="px-3 py-2 text-left font-normal"><span className="eyebrow">Adjuster</span></th>
              <th className="px-3 py-2 text-right font-normal"><span className="eyebrow">Rebuild every</span></th>
              <th className="px-3 py-2 text-right font-normal"><span className="eyebrow">Rebuild $</span></th>
              {heavy && <th className="px-3 py-2 text-left font-normal"><span className="eyebrow">Coil rates</span></th>}
              <th className="px-3 py-2 text-right font-normal"><span className="eyebrow">Gaps</span></th>
            </tr>
          </thead>
          <tbody>
            {SHOCKS.map((s) => (
              <tr key={s.id} className="border-b border-rule last:border-0 align-top hover:bg-surface-2">
                <td className="px-3 py-2.5">
                  <button onClick={() => setOpen(open === s.id ? null : s.id)} className="text-left hover:text-accent">
                    <span className="block font-medium">{s.brand}</span>
                    <span className="block text-[12px] text-ink-2">{s.model}</span>
                  </button>
                </td>
                <td className="num whitespace-nowrap px-3 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={known(s.price) ? "" : "text-ink-3 italic"}>
                      {known(s.price) ? money(s.price.value) : "not sold separately"}
                    </span>
                    <ConfidenceMeter c={s.price.confidence} />
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[12px] text-ink-2">
                  {s.position === "front+rear" ? "front + rear" : s.position}
                </td>
                <td className="px-3 py-2.5 text-ink-2">
                  {known(s.adjuster) ? (
                    <span className="inline-flex items-center gap-1.5">
                      {ADJUSTER_LABEL[s.adjuster.value]}
                      <ConfidenceMeter c={s.adjuster.confidence} />
                    </span>
                  ) : (
                    <span className="italic text-ink-3">not published</span>
                  )}
                  {s.variants && s.variants.length > 1 && (
                    <span className="eyebrow ml-1.5" style={{ color: "var(--accent)" }}>
                      +{s.variants.length - 1} cfg
                    </span>
                  )}
                </td>
                <td className="num whitespace-nowrap px-3 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={known(s.rebuildIntervalMi) ? "" : "text-ink-3 italic"}>
                      {known(s.rebuildIntervalMi) ? `${miles(s.rebuildIntervalMi.value)} mi` : "—"}
                    </span>
                    <ConfidenceMeter c={s.rebuildIntervalMi.confidence} />
                  </span>
                </td>
                <td className="num whitespace-nowrap px-3 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={known(s.rebuildCost) ? "" : "text-ink-3 italic"}>
                      {known(s.rebuildCost) ? money(s.rebuildCost.value) : "—"}
                    </span>
                    <ConfidenceMeter c={s.rebuildCost.confidence} />
                  </span>
                </td>
                {heavy && (
                  <td className="px-3 py-2.5 text-[12px]">
                    {known(s.springRatesLbIn) ? (
                      <span className="inline-flex items-center gap-1.5 text-ink-2">
                        {s.springRatesLbIn.value.map((r) => `${r}`).join(" / ")} lb/in
                        <ConfidenceMeter c={s.springRatesLbIn.confidence} />
                      </span>
                    ) : (
                      <span className="italic text-ink-3">not published, expect a revalve</span>
                    )}
                  </td>
                )}
                <td className="num px-3 py-2.5 text-right">
                  <span
                    className="inline-block min-w-6 rounded-sm px-1.5 py-0.5 text-[11px]"
                    style={{
                      background: s.gaps.length >= 6 ? "color-mix(in srgb, var(--bad) 18%, transparent)" : "var(--surface-2)",
                      color: s.gaps.length >= 6 ? "var(--bad)" : "var(--ink-2)",
                    }}
                  >
                    {s.gaps.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="eyebrow mt-2">
        Click a shock for the full sheet. Price is not sortable here on purpose: some of these are a front pair and some are
        four corners, so the column does not compare.
      </p>

      {open && <Detail shock={SHOCKS.find((s) => s.id === open)!} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-rule py-2.5 last:border-0">
      <div className="eyebrow mb-1">{label}</div>
      <div className="text-[14px] leading-snug">{children}</div>
    </div>
  );
}

function Detail({ shock: s, onClose }: { shock: Shock; onClose: () => void }) {
  return (
    <div className="card mt-4 rise">
      <div className="flex items-start justify-between gap-4 border-b border-rule-strong px-4 py-3">
        <div>
          <div className="eyebrow">
            <SourcedValue fact={s.partNumber} render={(v: string) => v} fallback="no part number" />
          </div>
          <h4 className="display mt-1 text-[1.3rem]">{s.brand} {s.model}</h4>
        </div>
        <button onClick={onClose} className="eyebrow hover:text-accent">Close</button>
      </div>

      <div className="grid gap-x-8 p-4 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-[14px] leading-relaxed">{s.blurb}</p>
          <Row label="Price">
            <SourcedValue fact={s.price} render={(v: number) => money(v)} fallback="Not sold separately" />
            {s.priceRetailer && <span className="ml-2 text-[13px] text-ink-3">at {s.priceRetailer}</span>}
            <div className="mt-1 text-[13px] text-ink-3">{s.covers}</div>
          </Row>
          <Row label="Body">
            <SourcedValue fact={s.bodyDiaIn} render={(v: number) => `${v}" diameter`} />
          </Row>
          <Row label="Reservoir">
            <SourcedValue fact={s.reservoir} render={(v: string) => RESERVOIR_LABEL[v as keyof typeof RESERVOIR_LABEL]} />
          </Row>
          <Row label="Adjuster">
            <SourcedValue fact={s.adjuster} render={(v: string) => ADJUSTER_LABEL[v as keyof typeof ADJUSTER_LABEL]} />
          </Row>
          <Row label="Lift range">
            <SourcedValue fact={s.liftRangeIn} render={(v: [number, number]) => `${v[0]}" to ${v[1]}"`} />
          </Row>
          <Row label="Travel">
            <SourcedValue fact={s.travelIn} render={(v: number) => `${v}"`} />
          </Row>
        </div>

        <div>
          <Row label="Coil rates offered">
            <SourcedValue
              fact={s.springRatesLbIn}
              render={(v: number[]) => v.map((r) => `${r} lb/in`).join(", ")}
              fallback="No published coil rate options"
            />
          </Row>
          <Row label="Needs an aftermarket upper arm">
            <SourcedValue fact={s.requiresUca} render={(v: boolean) => (v ? "Yes" : "No")} fallback="Not stated" />
          </Row>
          <Row label="Rebuild interval">
            <SourcedValue
              fact={s.rebuildIntervalMi}
              render={(v: [number, number]) => `${miles(v)} miles`}
              fallback="Nobody publishes one"
            />
          </Row>
          <Row label="Rebuild cost">
            <SourcedValue fact={s.rebuildCost} render={(v: number) => `${money(v)} a set`} fallback="No published price" />
            {s.rebuildNote && <div className="mt-1 text-[13px] text-ink-3">{s.rebuildNote}</div>}
          </Row>
          <Row label="Warranty">
            <SourcedValue fact={s.warranty} render={(v: string) => v} fallback="Nothing published" />
          </Row>
        </div>
      </div>

      {s.variants && s.variants.length > 1 && (
        <div className="border-t border-rule px-4 py-3">
          <div className="eyebrow mb-2.5">Sold in {s.variants.length} configurations</div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {s.variants.map((v) => (
              <div key={v.label} className="rounded-sm border border-rule bg-surface p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-medium">{v.label}</span>
                  <span className="num text-[13px]">
                    <SourcedValue fact={v.price} render={(x: number) => money(x)} fallback="no separate price" />
                  </span>
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{v.changes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {s.fieldReports.length > 0 && (
        <div className="border-t border-rule px-4 py-3">
          {s.fieldReports.map((r, i) => (
            <div key={i} className="mb-2.5 rounded-sm border-l-2 bg-surface p-3.5 last:mb-0" style={{ borderLeftColor: TONE[r.tone].color }}>
              <div className="eyebrow mb-1" style={{ color: TONE[r.tone].color }}>{TONE[r.tone].label}</div>
              <p className="text-[13.5px] leading-relaxed text-ink-2">{r.text}</p>
              <div className="mt-1.5">{r.sources.map((src) => <SourceLink key={src.url} s={src} />)}</div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-rule px-4 py-3">
        <div className="eyebrow mb-2" style={{ color: "var(--accent)" }}>
          Still missing — {s.gaps.length} {s.gaps.length === 1 ? "item" : "items"}
        </div>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {s.gaps.map((g) => (
            <li key={g} className="flex gap-2.5 text-[13.5px] leading-snug text-ink-2">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0" style={{ background: "var(--accent)" }} />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
