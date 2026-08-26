"use client";

import { useState } from "react";
import { ARMS } from "@/data/arms";
import { known } from "@/data/types";

/**
 * The hero's thesis, drawn rather than claimed. One protractor per arm, in the
 * order they sit on the price list. Solid arc means somebody published a caster
 * figure. Dashed means nobody did. The shape of the row is the argument.
 */
export function CasterStrip() {
  const [hover, setHover] = useState<string | null>(null);
  const MAX = 5;

  const sorted = [...ARMS].sort((a, b) => {
    const av = known(a.casterDeg) ? a.casterDeg.value[1] : -1;
    const bv = known(b.casterDeg) ? b.casterDeg.value[1] : -1;
    return bv - av;
  });

  const shown = sorted.find((a) => a.id === hover) ?? null;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-x-1 gap-y-3 sm:gap-x-2">
        {sorted.map((arm, i) => {
          const fact = arm.casterDeg;
          const isKnown = known(fact);
          const hi = isKnown ? fact.value[1] : 0;
          const w = 54;
          const r = 20;
          const cx = w / 2;
          const cy = 33;
          const sweep = 150;
          const start = 180 + (180 - sweep) / 2;
          const pt = (deg: number) => {
            const a = ((start + (deg / MAX) * sweep) * Math.PI) / 180;
            return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
          };
          const path = (from: number, to: number) => {
            const [x1, y1] = pt(from);
            const [x2, y2] = pt(to);
            return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
          };
          return (
            <button
              key={arm.id}
              onMouseEnter={() => setHover(arm.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(arm.id)}
              onBlur={() => setHover(null)}
              className="rise opacity-90 transition-opacity hover:opacity-100"
              style={{ animationDelay: `${i * 40}ms` }}
              aria-label={`${arm.brand} ${arm.model}: ${isKnown ? `${hi} degrees` : "no published caster figure"}`}
            >
              <svg width={w} height={40} viewBox={`0 0 ${w} 40`}>
                <path d={path(0, MAX)} fill="none" stroke="var(--rule)" strokeWidth={4} />
                {isKnown ? (
                  <path d={path(0, hi)} fill="none" stroke="var(--accent)" strokeWidth={4} />
                ) : (
                  <path d={path(0, MAX)} fill="none" stroke="var(--ink-3)" strokeWidth={4} strokeDasharray="2 3.5" opacity={0.5} />
                )}
                <text
                  x={cx}
                  y={cy - 3}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fontWeight={700}
                  fill={isKnown ? "var(--ink)" : "var(--ink-3)"}
                >
                  {isKnown ? `${hi}°` : "?"}
                </text>
              </svg>
            </button>
          );
        })}
      </div>
      <div className="num mt-2 h-5 text-[12px] text-ink-2">
        {shown ? (
          <>
            <span className="text-ink">{shown.brand} {shown.model}</span>
            {" — "}
            {known(shown.casterDeg)
              ? shown.casterDeg.value[0] === shown.casterDeg.value[1]
                ? `${shown.casterDeg.value[1]}° of caster`
                : `${shown.casterDeg.value[0]}° to ${shown.casterDeg.value[1]}°`
              : "no published caster figure"}
          </>
        ) : (
          <span className="text-ink-3">Solid arc, somebody published a number. Dashed, nobody did.</span>
        )}
      </div>
    </div>
  );
}
