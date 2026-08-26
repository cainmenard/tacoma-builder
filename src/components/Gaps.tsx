"use client";

import { useMemo, useState } from "react";
import { ARMS } from "@/data/arms";
import { S } from "@/data/sources";

/**
 * The gaps board. Every unpublished spec in the dataset, grouped by what would
 * close it. This is the part of the app that gets better when the thread reads it.
 */
export function Gaps() {
  const [copied, setCopied] = useState(false);

  const byTopic = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const arm of ARMS) {
      for (const g of arm.gaps) {
        const topic = normalize(g);
        const set = map.get(topic) ?? new Set<string>();
        set.add(`${arm.brand} ${arm.model}`);
        map.set(topic, set);
      }
    }
    return [...map.entries()]
      .map(([topic, set]) => [topic, [...set]] as [string, string[]])
      .sort((a, b) => b[1].length - a[1].length);
  }, []);

  const total = ARMS.reduce((n, a) => n + a.gaps.length, 0);

  const post = useMemo(() => {
    const lines = [
      "Running one of these arms? Two numbers from you close a hole in the data:",
      "",
      "1. Your alignment printout, before and after. That gives us caster in degrees, which is the number almost nobody publishes.",
      "2. The arms on a bathroom scale, out of the box, both arms together.",
      "",
      "The biggest holes right now:",
      ...byTopic.slice(0, 5).map(([topic, arms]) => `- ${topic}: ${arms.length} arms (${arms.slice(0, 3).join(", ")}${arms.length > 3 ? ", and more" : ""})`),
      "",
      "Post the numbers in the thread and they go into the tool.",
    ];
    return lines.join("\n");
  }, [byTopic]);

  return (
    <div>
      <div className="card mb-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="display text-[2.6rem]" style={{ color: "var(--accent)" }}>{total}</span>
          <span className="max-w-[46ch] text-[14px] leading-relaxed text-ink-2">
            specs across 14 arms that nobody publishes. Not estimated, not inferred, not quietly rounded into something
            that looks like data. Listed.
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {byTopic.map(([topic, arms]) => (
          <div key={topic} className="card p-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] font-medium">{topic}</span>
              <span className="num shrink-0 text-[12px]" style={{ color: arms.length >= 6 ? "var(--accent)" : "var(--ink-3)" }}>
                {arms.length} {arms.length === 1 ? "arm" : "arms"}
              </span>
            </div>
            <div className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">{arms.join(" · ")}</div>
          </div>
        ))}
      </div>

      <div className="card mt-4 p-4 sm:p-5">
        <div className="eyebrow mb-2">Help close them</div>
        <p className="max-w-[64ch] text-[14px] leading-relaxed text-ink-2">
          Two things from anyone running a set: the alignment printout from before and after the install, which is the only
          way most of these caster numbers ever get measured, and the arms on a bathroom scale out of the box. Post them in
          the thread and they get added here with your handle on them.
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(post).then(
                () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2200);
                },
                () => setCopied(false)
              );
            }}
            className="num rounded-sm border border-accent bg-accent px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] text-accent-ink"
          >
            {copied ? "Copied" : "Copy the ask for the thread"}
          </button>
          <a
            href={S.originalThread.url}
            target="_blank"
            rel="noopener noreferrer"
            className="num rounded-sm border border-rule px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] text-ink-2 hover:border-accent hover:text-accent"
          >
            Open the thread
          </a>
        </div>
      </div>
    </div>
  );
}

/** Collapse per-arm phrasing into a shared topic so the board groups usefully. */
function normalize(g: string): string {
  const s = g.toLowerCase();
  if (s.includes("caster")) {
    return s.includes("manufacturer") || s.includes("confirmed")
      ? "Manufacturer confirmation of a caster figure"
      : "Caster correction in degrees";
  }
  if (s.includes("warranty")) return "Warranty terms";
  if (s.includes("weight")) return "Verified weight";
  if (s.includes("lift range")) return "Published lift range";
  if (s.includes("articulation")) return "Articulation figure";
  if (s.includes("rebuild") || s.includes("joint cost") || s.includes("replacement joint")) return "Rebuild or replacement joint cost";
  if (s.includes("interval")) return "Service interval";
  if (s.includes("price") || s.includes("fitment")) return "Price and availability";
  if (s.includes("durability") || s.includes("failure") || s.includes("tire")) return "Independent durability evidence";
  if (s.includes("retrofit") || s.includes("2016-2021")) return "Fitment confirmation";
  if (s.includes("maintenance")) return "Maintenance requirement";
  if (s.includes("ball joint brand")) return "Joint brand and serviceability";
  return g;
}
