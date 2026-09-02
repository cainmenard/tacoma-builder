"use client";

import { useEffect } from "react";
import { ARMS_BY_ID } from "@/data/arms";
import { known, PIVOT_LABEL } from "@/data/types";
import type { Arm } from "@/data/types";
import { CasterGauge } from "./CasterGauge";
import { SourcedValue, SourceLink, ConfidenceMeter } from "./Primitives";
import { money } from "@/lib/format";

const TONE = {
  concern: { color: "var(--bad)", label: "Concern" },
  praise: { color: "var(--good)", label: "Owner report" },
  mixed: { color: "var(--warn)", label: "Unresolved" },
};

export function SpecSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [id, onClose]);

  if (!id) return null;
  const arm = ARMS_BY_ID[id];
  if (!arm) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`${arm.brand} ${arm.model} spec sheet`}>
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_55%,transparent)]" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[560px] flex-col border-l border-rule-strong bg-paper shadow-2xl rise">
        <header className="flex items-start gap-4 border-b border-rule-strong p-5">
          <div className="min-w-0 flex-1">
            <div className="eyebrow">
              <SourcedValue fact={arm.partNumber} render={(v: string) => v} fallback="no part number" />
            </div>
            <h3 className="display mt-1.5 text-[1.7rem]">{arm.brand}</h3>
            <div className="text-[15px] text-ink-2">{arm.model}</div>
          </div>
          <CasterGauge arm={arm} size={92} />
          <button
            onClick={onClose}
            aria-label="Close"
            className="num -mt-1 shrink-0 rounded-sm border border-rule px-2 py-1 text-[13px] text-ink-2 hover:border-accent hover:text-accent"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-[15px] leading-relaxed">{arm.blurb}</p>

          <Grid arm={arm} />

          {arm.fieldReports.length > 0 && (
            <section className="mt-7">
              <div className="eyebrow mb-2.5">What owners and sources actually report</div>
              {arm.fieldReports.map((r, i) => (
                <div key={i} className="mb-2.5 rounded-sm border-l-2 bg-surface p-3.5" style={{ borderLeftColor: TONE[r.tone].color }}>
                  <div className="eyebrow mb-1" style={{ color: TONE[r.tone].color }}>{TONE[r.tone].label}</div>
                  <p className="text-[13.5px] leading-relaxed text-ink-2">{r.text}</p>
                  <div className="mt-1.5">{r.sources.map((s) => <SourceLink key={s.url} s={s} />)}</div>
                </div>
              ))}
            </section>
          )}

          <section className="mt-7">
            <div className="eyebrow mb-2.5" style={{ color: "var(--accent)" }}>
              Still missing — {arm.gaps.length} {arm.gaps.length === 1 ? "item" : "items"}
            </div>
            <ul className="space-y-1.5">
              {arm.gaps.map((g) => (
                <li key={g} className="flex gap-2.5 text-[13.5px] leading-snug text-ink-2">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0" style={{ background: "var(--accent)" }} />
                  {g}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
              Running these arms? The gaps above close when somebody who owns a set posts the number.
            </p>
          </section>
        </div>
      </div>
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

function Grid({ arm }: { arm: Arm }) {
  return (
    <div className="mt-5">
      <Row label="Price">
        <SourcedValue fact={arm.price} render={(v: number) => money(v)} fallback="No US price sourced" />
        {arm.priceRetailer && <span className="ml-2 text-[13px] text-ink-3">at {arm.priceRetailer}</span>}
      </Row>
      <Row label="Caster correction">
        <SourcedValue
          fact={arm.casterDeg}
          render={(v: [number, number]) => (v[0] === v[1] ? `${v[1]}°` : `${v[0]}° to ${v[1]}°, adjustable`)}
        />
      </Row>
      <Row label="Adjustment mechanism">
        <SourcedValue fact={arm.casterMechanism} render={(v: string) => v} />
      </Row>
      <Row label="Material">
        <SourcedValue fact={arm.material} render={(v: string) => v} />
      </Row>
      <Row label="Knuckle joint">
        <SourcedValue fact={arm.jointName} render={(v: string) => v} />
      </Row>
      <Row label="Frame-side pivot">
        <SourcedValue
          fact={arm.framePivotName}
          render={(v: string) => v}
          fallback="Nobody publishes what is at the frame end"
        />
        {known(arm.framePivotFamily) && (
          <span className="ml-2 num text-[13px] text-ink-3">
            {PIVOT_LABEL[arm.framePivotFamily.value]}
            <ConfidenceMeter c={arm.framePivotFamily.confidence} />
          </span>
        )}
      </Row>
      <Row label="Articulation">
        <SourcedValue fact={arm.articulationDeg} render={(v: number) => `${v}°`} />
      </Row>
      <Row label="Weight per pair">
        <SourcedValue fact={arm.weightLbPair} render={(v: number) => `${v} lb`} />
      </Row>
      <Row label="Service">
        <SourcedValue
          fact={arm.maintenanceClass}
          render={(v: string) => (v === "sealed" ? "Sealed, nothing scheduled" : v === "low" ? "Light service" : "Greaseable")}
          fallback="No published maintenance requirement"
        />
        {known(arm.serviceIntervalMi) && (
          <span className="ml-2 num text-[13px] text-ink-3">
            every {arm.serviceIntervalMi.value.toLocaleString()} mi
            <ConfidenceMeter c={arm.serviceIntervalMi.confidence} />
          </span>
        )}
      </Row>
      <Row label="Rebuild cost">
        <SourcedValue fact={arm.rebuildCost} render={(v: number) => `${money(v)} in parts`} fallback="No rebuild kit price published" />
        {arm.rebuildNote && <div className="mt-1 text-[13px] text-ink-3">{arm.rebuildNote}</div>}
      </Row>
      <Row label="Lift range">
        <SourcedValue fact={arm.liftRangeIn} render={(v: [number, number]) => `${v[0]}" to ${v[1]}"`} />
      </Row>
      <Row label="Warranty">
        <SourcedValue fact={arm.warranty} render={(v: string) => v} fallback="Nothing published" />
      </Row>
    </div>
  );
}
