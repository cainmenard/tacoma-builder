"use client";

import { useState, useId } from "react";
import { CONFIDENCE_LABEL, CONFIDENCE_RANK, known } from "@/data/types";
import type { Confidence, Maybe, Source } from "@/data/types";

const CONF_COLOR: Record<Confidence, string> = {
  "independent-test": "var(--c6)",
  manufacturer: "var(--good)",
  retailer: "var(--c1)",
  community: "var(--warn)",
  estimate: "var(--c5)",
  gap: "var(--ink-3)",
};

/**
 * Five-segment sourcing meter. Every number on this site wears one, so you can
 * tell a measured figure from a manufacturer spec from a forum guess without
 * reading a footnote. The fifth segment only lights up for a number somebody
 * actually measured, which is why most of this board tops out at four.
 */
export function ConfidenceMeter({ c, showLabel = false }: { c: Confidence; showLabel?: boolean }) {
  const filled = CONFIDENCE_RANK[c];
  return (
    <span className="inline-flex items-center gap-1.5 align-middle" title={CONFIDENCE_LABEL[c]}>
      <span className="inline-flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              height: 2 + i * 2,
              width: 3,
              background: i <= filled ? CONF_COLOR[c] : "var(--rule-strong)",
              opacity: i <= filled ? 1 : 0.45,
            }}
          />
        ))}
      </span>
      {showLabel && <span className="eyebrow" style={{ color: CONF_COLOR[c] }}>{CONFIDENCE_LABEL[c]}</span>}
      <span className="sr-only">{CONFIDENCE_LABEL[c]}</span>
    </span>
  );
}

/** A value plus its meter plus its sources, expandable. */
export function SourcedValue({
  fact,
  render,
  fallback = "No published spec",
  className = "",
}: {
  fact: Maybe<unknown> | undefined;
  render: (v: never) => React.ReactNode;
  fallback?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  if (!fact) return <span className="text-ink-3">—</span>;
  const isKnown = known(fact);
  const hasDetail = fact.sources.length > 0 || !!fact.note || (!isKnown && !!(fact as { needed?: string }).needed);

  return (
    <span className={className}>
      <button
        type="button"
        onClick={() => hasDetail && setOpen((o) => !o)}
        aria-expanded={hasDetail ? open : undefined}
        aria-controls={hasDetail ? id : undefined}
        className={`inline-flex items-baseline gap-2 text-left ${hasDetail ? "cursor-pointer hover:text-accent" : "cursor-default"}`}
      >
        <span className={isKnown ? "" : "text-ink-3 italic"}>
          {isKnown ? render(fact.value as never) : fallback}
        </span>
        <ConfidenceMeter c={fact.confidence} />
      </button>
      {open && hasDetail && (
        <span id={id} className="mt-2 block rounded-sm border border-rule bg-surface-2 p-3 text-[13px] leading-relaxed">
          <span className="eyebrow block mb-1.5">{CONFIDENCE_LABEL[fact.confidence]}</span>
          {fact.note && <span className="block text-ink-2 mb-2">{fact.note}</span>}
          {!isKnown && (fact as { needed?: string }).needed && (
            <span className="block text-ink-2 mb-2">
              <span className="text-accent font-medium">Still needed: </span>
              {(fact as { needed?: string }).needed}
            </span>
          )}
          {fact.sources.map((s) => (
            <SourceLink key={s.url} s={s} />
          ))}
        </span>
      )}
    </span>
  );
}

export function SourceLink({ s }: { s: Source }) {
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 block text-ink-2 underline decoration-rule-strong underline-offset-2 hover:text-accent hover:decoration-accent"
    >
      {s.label}
      {s.quote && <span className="mt-0.5 block text-ink-3 italic no-underline">&ldquo;{s.quote}&rdquo;</span>}
    </a>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function SectionHead({
  index,
  title,
  lede,
  id,
}: {
  index: string;
  title: string;
  lede: string;
  id: string;
}) {
  return (
    <header id={id} className="scroll-mt-20 border-t border-rule-strong pt-5">
      <div className="flex items-baseline gap-4">
        <span className="num text-[13px] text-accent">{index}</span>
        <h2 className="display text-[clamp(1.6rem,4vw,2.4rem)]">{title}</h2>
      </div>
      <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{lede}</p>
    </header>
  );
}
