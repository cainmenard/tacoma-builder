"use client";

import { useMemo, useState } from "react";
import { ARMS } from "@/data/arms";
import { known } from "@/data/types";
import type { Arm } from "@/data/types";
import { ConfidenceMeter } from "./Primitives";
import { money } from "@/lib/format";

type SortKey = "price" | "caster" | "articulation" | "weight" | "gaps" | "brand";
type MaintFilter = "all" | "sealed" | "greaseable";

const MAINT_LABEL: Record<string, string> = {
  sealed: "Sealed",
  low: "Light service",
  greaseable: "Greaseable",
};

export function CompareTable({
  pinned,
  onTogglePin,
  onOpen,
}: {
  pinned: string[];
  onTogglePin: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("price");
  const [asc, setAsc] = useState(true);
  const [maint, setMaint] = useState<MaintFilter>("all");
  const [adjOnly, setAdjOnly] = useState(false);
  const [casterOnly, setCasterOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1600);

  const rows = useMemo(() => {
    let out = ARMS.filter((a) => {
      if (maint === "sealed" && !(known(a.maintenanceClass) && a.maintenanceClass.value !== "greaseable")) return false;
      if (maint === "greaseable" && !(known(a.maintenanceClass) && a.maintenanceClass.value === "greaseable")) return false;
      if (adjOnly && !(known(a.casterAdjustable) && a.casterAdjustable.value)) return false;
      if (casterOnly && !known(a.casterDeg)) return false;
      if (known(a.price) && a.price.value > maxPrice) return false;
      return true;
    });
    const num = (a: Arm): number => {
      switch (sort) {
        case "price": return known(a.price) ? a.price.value : Infinity;
        case "caster": return known(a.casterDeg) ? a.casterDeg.value[1] : -Infinity;
        case "articulation": return known(a.articulationDeg) ? a.articulationDeg.value : -Infinity;
        case "weight": return known(a.weightLbPair) ? a.weightLbPair.value : Infinity;
        case "gaps": return a.gaps.length;
        default: return 0;
      }
    };
    out = [...out].sort((x, y) =>
      sort === "brand"
        ? (asc ? 1 : -1) * x.brand.localeCompare(y.brand)
        : (asc ? 1 : -1) * (num(x) - num(y))
    );
    return out;
  }, [sort, asc, maint, adjOnly, casterOnly, maxPrice]);

  function head(key: SortKey, label: string, align: "left" | "right" = "right") {
    const active = sort === key;
    return (
      <th className={`whitespace-nowrap px-3 py-2 text-${align} font-normal`}>
        <button
          onClick={() => {
            if (active) setAsc((v) => !v);
            else {
              setSort(key);
              setAsc(key === "price" || key === "weight" || key === "gaps" || key === "brand");
            }
          }}
          className={`eyebrow inline-flex items-center gap-1 hover:text-ink ${active ? "text-accent" : ""}`}
        >
          {label}
          <span className="w-2">{active ? (asc ? "↑" : "↓") : ""}</span>
        </button>
      </th>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="card mb-3 flex flex-wrap items-center gap-x-5 gap-y-3 p-3.5">
        <div className="flex items-center gap-1.5">
          <span className="eyebrow">Service</span>
          {(["all", "sealed", "greaseable"] as MaintFilter[]).map((m) => (
            <button
              key={m}
              onClick={() => setMaint(m)}
              className={`num rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.09em] ${
                maint === m ? "border-accent bg-accent text-accent-ink" : "border-rule text-ink-2 hover:text-ink"
              }`}
            >
              {m === "all" ? "Any" : m === "sealed" ? "No grease gun" : "Greaseable"}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-[13px]">
          <input type="checkbox" checked={adjOnly} onChange={(e) => setAdjOnly(e.target.checked)} className="accent-[var(--accent)]" />
          Adjustable caster only
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-[13px]">
          <input type="checkbox" checked={casterOnly} onChange={(e) => setCasterOnly(e.target.checked)} className="accent-[var(--accent)]" />
          Has a published caster number
        </label>

        <label className="flex min-w-[190px] flex-1 items-center gap-3 text-[13px]">
          <span className="eyebrow whitespace-nowrap">Under</span>
          <input
            type="range"
            min={550}
            max={1600}
            step={25}
            value={maxPrice}
            onChange={(e) => setMaxPrice(+e.target.value)}
          />
          <span className="num w-14 shrink-0 text-right">${maxPrice.toLocaleString()}</span>
        </label>

        <div className="num text-[12px] text-ink-3">
          <span className="text-accent">{rows.length}</span>/14 shown
        </div>
      </div>

      {/* Table */}
      <div className="card scroll-x">
        <table className="w-full min-w-[860px] border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-rule-strong">
              <th className="w-9 px-3 py-2" />
              {head("brand", "Arm", "left")}
              {head("price", "Price")}
              {head("caster", "Caster")}
              {head("articulation", "Artic.")}
              {head("weight", "Weight lb")}
              <th className="px-3 py-2 text-left font-normal"><span className="eyebrow">Joint</span></th>
              <th className="px-3 py-2 text-left font-normal"><span className="eyebrow">Service</span></th>
              {head("gaps", "Gaps")}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const isPinned = pinned.includes(a.id);
              return (
                <tr
                  key={a.id}
                  className={`border-b border-rule last:border-0 hover:bg-surface-2 ${isPinned ? "bg-accent/6" : ""}`}
                >
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={() => onTogglePin(a.id)}
                      className="accent-[var(--accent)]"
                      aria-label={`Compare ${a.brand} ${a.model}`}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => onOpen(a.id)} className="text-left hover:text-accent">
                      <span className="block font-medium">{a.brand}</span>
                      <span className="block text-[12px] text-ink-2">{a.model}</span>
                    </button>
                  </td>
                  <Cell
                    text={known(a.price) ? money(a.price.value) : "no US price"}
                    c={a.price.confidence}
                    muted={!known(a.price)}
                  />
                  <Cell
                    text={
                      known(a.casterDeg)
                        ? a.casterDeg.value[0] === a.casterDeg.value[1]
                          ? `${a.casterDeg.value[1]}°`
                          : `${a.casterDeg.value[0]}–${a.casterDeg.value[1]}°`
                        : "—"
                    }
                    c={a.casterDeg.confidence}
                    muted={!known(a.casterDeg)}
                    suffix={known(a.casterAdjustable) && a.casterAdjustable.value ? "adj" : undefined}
                  />
                  <Cell
                    text={known(a.articulationDeg) ? `${a.articulationDeg.value}°` : "—"}
                    c={a.articulationDeg.confidence}
                    muted={!known(a.articulationDeg)}
                  />
                  <Cell
                    text={known(a.weightLbPair) ? `${a.weightLbPair.value}` : "—"}
                    c={a.weightLbPair.confidence}
                    muted={!known(a.weightLbPair)}
                  />
                  <td className="px-3 py-2.5 text-ink-2">{a.jointFamily.replace("-", " ")}</td>
                  <td className="px-3 py-2.5 text-ink-2">
                    {known(a.maintenanceClass) ? MAINT_LABEL[a.maintenanceClass.value] : <span className="italic text-ink-3">unknown</span>}
                  </td>
                  <td className="num px-3 py-2.5 text-right">
                    <span
                      className="inline-block min-w-6 rounded-sm px-1.5 py-0.5 text-[11px]"
                      style={{
                        background: a.gaps.length >= 5 ? "color-mix(in srgb, var(--bad) 18%, transparent)" : "var(--surface-2)",
                        color: a.gaps.length >= 5 ? "var(--bad)" : "var(--ink-2)",
                      }}
                    >
                      {a.gaps.length}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="eyebrow mt-2">Tick the boxes to compare side by side. Click an arm for its full spec sheet.</p>
    </div>
  );
}

function Cell({
  text,
  c,
  muted,
  suffix,
}: {
  text: string;
  c: Arm["price"]["confidence"];
  muted?: boolean;
  suffix?: string;
}) {
  return (
    <td className="num whitespace-nowrap px-3 py-2.5 text-right">
      <span className="inline-flex items-center gap-1.5">
        <span className={muted ? "text-ink-3 italic" : ""}>{text}</span>
        {suffix && <span className="eyebrow" style={{ color: "var(--accent)" }}>{suffix}</span>}
        <ConfidenceMeter c={c} />
      </span>
    </td>
  );
}
