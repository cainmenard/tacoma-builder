"use client";

import type { Arm } from "@/data/types";
import { known } from "@/data/types";

/**
 * The signature graphic. A protractor arc showing caster correction, drawn the
 * way an alignment printout would show it. Arms with no published figure get a
 * dashed empty arc, which is the honest answer and also the most useful one:
 * it shows at a glance how much of this market ships without a number.
 */
export function CasterGauge({ arm, size = 96 }: { arm: Arm; size?: number }) {
  const MAX = 5; // degrees of scale
  const r = size * 0.42;
  const cx = size / 2;
  const cy = size * 0.86;
  const sweep = 150; // degrees of arc drawn
  const start = 180 + (180 - sweep) / 2;

  const pt = (deg: number, radius: number) => {
    const a = ((start + (deg / MAX) * sweep) * Math.PI) / 180;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const;
  };
  const arc = (from: number, to: number, radius: number) => {
    const [x1, y1] = pt(from, radius);
    const [x2, y2] = pt(to, radius);
    const large = ((to - from) / MAX) * sweep > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  const casterFact = arm.casterDeg;
  const isKnown = known(casterFact);
  const dense = size < 84;
  const [lo, hi]: [number, number] = isKnown ? casterFact.value : [0, 0];
  const adjustable = known(arm.casterAdjustable) && arm.casterAdjustable.value;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={
        isKnown
          ? lo === hi
            ? `${lo} degrees of caster correction`
            : `${lo} to ${hi} degrees of adjustable caster correction`
          : "No published caster figure"
      }
    >
      {/* scale ticks */}
      {Array.from({ length: MAX + 1 }, (_, i) => {
        const [x1, y1] = pt(i, r - 4);
        const [x2, y2] = pt(i, r + (i % 1 === 0 ? 4 : 2));
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--rule-strong)" strokeWidth={1} />
            {!dense && (
              <text
                {...(() => {
                  const [tx, ty] = pt(i, r + 12);
                  return { x: tx, y: ty };
                })()}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.085}
                fill="var(--ink-3)"
                fontFamily="var(--font-mono)"
              >
                {i}
              </text>
            )}
          </g>
        );
      })}

      {/* base arc */}
      <path d={arc(0, MAX, r)} fill="none" stroke="var(--rule)" strokeWidth={size * 0.075} strokeLinecap="butt" />

      {isKnown ? (
        <path
          d={arc(lo === hi ? 0 : lo, hi, r)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={size * 0.075}
          strokeLinecap="butt"
        />
      ) : (
        <path
          d={arc(0, MAX, r)}
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth={size * 0.075}
          strokeDasharray="3 5"
          opacity={0.55}
        />
      )}

      {/* needle at the upper bound */}
      {isKnown && (
        <line
          x1={cx}
          y1={cy}
          {...(() => {
            const [x, y] = pt(hi, r - size * 0.06);
            return { x2: x, y2: y };
          })()}
          stroke="var(--ink)"
          strokeWidth={1.5}
        />
      )}
      <circle cx={cx} cy={cy} r={2.5} fill="var(--ink)" />

      {/* readout, kept clear of the arc */}
      <text
        x={cx}
        y={cy - r - size * 0.115}
        textAnchor="middle"
        fontSize={size * (lo === hi ? 0.19 : 0.145)}
        fontFamily="var(--font-mono)"
        fontWeight={700}
        fill={isKnown ? "var(--ink)" : "var(--ink-3)"}
      >
        {isKnown ? (lo === hi ? `${hi}\u00b0` : `${lo}\u2013${hi}\u00b0`) : "\u2014"}
        {adjustable && (
          <tspan fontSize={size * 0.09} letterSpacing="0.06em" fill="var(--accent)">
            {"  ADJ"}
          </tspan>
        )}
      </text>
    </svg>
  );
}
