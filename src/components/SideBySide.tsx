"use client";

import { ARMS_BY_ID } from "@/data/arms";
import { known, PIVOT_LABEL } from "@/data/types";
import type { Arm } from "@/data/types";
import { CasterGauge } from "./CasterGauge";
import { ConfidenceMeter } from "./Primitives";
import { money } from "@/lib/format";

const ROWS: {
  label: string;
  get: (a: Arm) => { text: string; conf: Arm["price"]["confidence"]; muted?: boolean; plain?: boolean };
}[] = [
  {
    label: "Price",
    get: (a) => known(a.price)
      ? { text: money(a.price.value), conf: a.price.confidence }
      : { text: "no US price", conf: "gap", muted: true },
  },
  {
    label: "Caster",
    get: (a) => known(a.casterDeg)
      ? { text: a.casterDeg.value[0] === a.casterDeg.value[1] ? `${a.casterDeg.value[1]}°` : `${a.casterDeg.value[0]}–${a.casterDeg.value[1]}°`, conf: a.casterDeg.confidence }
      : { text: "not published", conf: "gap", muted: true },
  },
  {
    label: "Adjustable",
    get: (a) => ({ text: known(a.casterAdjustable) && a.casterAdjustable.value ? "Yes" : "No", conf: a.casterAdjustable.confidence }),
  },
  {
    label: "Articulation",
    get: (a) => known(a.articulationDeg)
      ? { text: `${a.articulationDeg.value}°`, conf: a.articulationDeg.confidence }
      : { text: "not published", conf: "gap", muted: true },
  },
  {
    label: "Weight / pair",
    get: (a) => known(a.weightLbPair)
      ? { text: `${a.weightLbPair.value} lb`, conf: a.weightLbPair.confidence }
      : { text: "not published", conf: "gap", muted: true },
  },
  { label: "Material", get: (a) => ({ text: a.material.value, conf: a.material.confidence }) },
  { label: "Knuckle joint", get: (a) => ({ text: a.jointName.value, conf: a.jointName.confidence }) },
  {
    label: "Frame pivot",
    get: (a) => known(a.framePivotName)
      ? { text: a.framePivotName.value, conf: a.framePivotName.confidence }
      : { text: "not published", conf: "gap", muted: true },
  },
  {
    label: "Pivot type",
    get: (a) => known(a.framePivotFamily)
      ? { text: PIVOT_LABEL[a.framePivotFamily.value], conf: a.framePivotFamily.confidence }
      : { text: "cannot be classified", conf: "gap", muted: true },
  },
  {
    label: "Service",
    get: (a) => known(a.maintenanceClass)
      ? { text: a.maintenanceClass.value === "sealed" ? "Sealed" : a.maintenanceClass.value === "low" ? "Light" : "Greaseable", conf: a.maintenanceClass.confidence }
      : { text: "unknown", conf: "gap", muted: true },
  },
  {
    label: "Rebuild parts",
    get: (a) => known(a.rebuildCost)
      ? { text: money(a.rebuildCost.value), conf: a.rebuildCost.confidence }
      : { text: "not published", conf: "gap", muted: true },
  },
  {
    label: "Warranty",
    get: (a) => known(a.warranty) ? { text: a.warranty.value, conf: a.warranty.confidence } : { text: "nothing published", conf: "gap", muted: true },
  },
  { label: "Open gaps", get: (a) => ({ text: `${a.gaps.length}`, conf: "manufacturer", plain: true }) },
];

export function SideBySide({ ids, onClear, onRemove }: { ids: string[]; onClear: () => void; onRemove: (id: string) => void }) {
  if (ids.length < 2) return null;
  const arms = ids.map((id) => ARMS_BY_ID[id]).filter(Boolean);

  return (
    <div className="card mt-4 scroll-x rise">
      <div className="flex items-center justify-between border-b border-rule-strong px-4 py-2.5">
        <span className="eyebrow">Side by side</span>
        <button onClick={onClear} className="eyebrow hover:text-accent">Clear</button>
      </div>
      <table className="w-full min-w-[620px] table-fixed border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="w-[120px] px-4 py-3" />
            {arms.map((a) => (
              <th key={a.id} className="border-l border-rule px-4 py-3 text-left align-top">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[14px] font-semibold">{a.brand}</div>
                    <div className="text-[12px] font-normal text-ink-2">{a.model}</div>
                  </div>
                  <button onClick={() => onRemove(a.id)} className="text-ink-3 hover:text-accent" aria-label={`Remove ${a.brand}`}>✕</button>
                </div>
                <div className="mt-2"><CasterGauge arm={a} size={72} /></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-t border-rule">
              <td className="px-4 py-2.5 align-top"><span className="eyebrow">{row.label}</span></td>
              {arms.map((a) => {
                const v = row.get(a);
                return (
                  <td key={a.id} className="border-l border-rule px-4 py-2.5 align-top">
                    <span className="inline-flex items-baseline gap-1.5">
                      <span className={v.muted ? "text-ink-3 italic" : ""}>{v.text}</span>
                      {!v.plain && <ConfidenceMeter c={v.conf} />}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
