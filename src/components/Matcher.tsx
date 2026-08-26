"use client";

import { useMemo, useState } from "react";
import { QUESTIONS, scoreArms, survivorCount } from "@/lib/match";
import type { Answers } from "@/lib/match";
import { known } from "@/data/types";
import { CasterGauge } from "./CasterGauge";
import { ConfidenceMeter } from "./Primitives";
import { money } from "@/lib/format";

export function Matcher({ onPick }: { onPick: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const done = QUESTIONS.every((q) => answers[q.key] !== undefined);

  const results = useMemo(() => (done ? scoreArms(answers as Answers) : []), [answers, done]);
  const live = results.filter((r) => !r.disqualified);
  const remaining = survivorCount(answers);

  function answer(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (step < QUESTIONS.length - 1) setTimeout(() => setStep((s) => s + 1), 160);
  }

  return (
    <div>
      {/* Step rail */}
      <div className="mb-6 flex items-center gap-2">
        {QUESTIONS.map((q, i) => {
          const answered = answers[q.key] !== undefined;
          return (
            <button
              key={q.key}
              onClick={() => setStep(i)}
              className="group flex-1 text-left"
              aria-label={`Step ${i + 1}: ${q.eyebrow}`}
            >
              <div
                className="h-[3px] w-full transition-colors"
                style={{ background: answered ? "var(--accent)" : i === step ? "var(--rule-strong)" : "var(--rule)" }}
              />
              <div
                className="eyebrow mt-1.5 truncate"
                style={{ color: i === step ? "var(--ink)" : undefined }}
              >
                {q.eyebrow}
              </div>
            </button>
          );
        })}
      </div>

      {/* Question */}
      <div key={step} className="rise">
        <h3 className="display text-[clamp(1.35rem,3.4vw,1.9rem)]">{QUESTIONS[step].prompt}</h3>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-ink-2">{QUESTIONS[step].help}</p>

        <div className={`mt-5 grid gap-2 ${QUESTIONS[step].options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {QUESTIONS[step].options.map((o) => {
            const selected = answers[QUESTIONS[step].key] === o.value;
            return (
              <button
                key={o.value}
                onClick={() => answer(QUESTIONS[step].key, o.value)}
                aria-pressed={selected}
                className={`rounded-sm border px-4 py-3.5 text-left transition-all ${
                  selected
                    ? "border-accent bg-accent/8 shadow-[inset_3px_0_0_var(--accent)]"
                    : "border-rule bg-surface hover:border-rule-strong hover:bg-surface-2"
                }`}
              >
                <div className="text-[15px] font-medium">{o.label}</div>
                {o.detail && <div className="mt-0.5 text-[13px] text-ink-2">{o.detail}</div>}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="num text-[12px] text-ink-3">
            <span className="text-accent">{remaining}</span> of 14 arms still in range
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="num rounded-sm border border-rule px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-2 hover:text-ink"
              >
                Back
              </button>
            )}
            {step < QUESTIONS.length - 1 && answers[QUESTIONS[step].key] !== undefined && (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="num rounded-sm border border-rule px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-2 hover:text-ink"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {done && (
        <div className="mt-10 border-t border-rule-strong pt-6 rise">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="display text-[1.5rem]">Your shortlist</h3>
            <button
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
              className="num text-[11px] uppercase tracking-[0.1em] text-ink-3 underline-offset-4 hover:text-accent hover:underline"
            >
              Start over
            </button>
          </div>
          <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-ink-2">
            Scored on your answers. Open any card to see exactly which of your answers moved it up or down, because a
            ranking you cannot audit is just an opinion with a number on it.
          </p>

          <div className="mt-5 space-y-2.5">
            {live.slice(0, 5).map((r, i) => (
              <ResultCard key={r.arm.id} r={r} rank={i + 1} onPick={onPick} />
            ))}
          </div>

          {results.some((r) => r.disqualified) && (
            <details className="mt-5">
              <summary className="eyebrow cursor-pointer hover:text-ink">
                {results.filter((r) => r.disqualified).length} arms over your budget
              </summary>
              <div className="mt-2 space-y-1">
                {results
                  .filter((r) => r.disqualified)
                  .map((r) => (
                    <div key={r.arm.id} className="num text-[12px] text-ink-3">
                      {r.arm.brand} {r.arm.model} — {r.disqualified}
                    </div>
                  ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function ResultCard({
  r,
  rank,
  onPick,
}: {
  r: ReturnType<typeof scoreArms>[number];
  rank: number;
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(rank === 1);
  const { arm } = r;
  const pos = r.lines.filter((l) => l.points > 0).sort((a, b) => b.points - a.points);
  const neg = r.lines.filter((l) => l.points < 0).sort((a, b) => a.points - b.points);

  return (
    <div className={`card overflow-hidden ${rank === 1 ? "border-accent" : ""}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left hover:bg-surface-2"
      >
        <span
          className="num flex h-8 w-8 shrink-0 items-center justify-center text-[13px] font-bold"
          style={{
            background: rank === 1 ? "var(--accent)" : "var(--surface-2)",
            color: rank === 1 ? "var(--accent-ink)" : "var(--ink-2)",
          }}
        >
          {rank}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-semibold">
            {arm.brand} <span className="font-normal text-ink-2">{arm.model}</span>
          </span>
          <span className="mt-0.5 block truncate text-[13px] text-ink-2">{arm.blurb}</span>
        </span>
        <span className="hidden shrink-0 sm:block">
          <CasterGauge arm={arm} size={68} />
        </span>
        <span className="num shrink-0 text-right">
          <span className="block text-[15px] font-bold">
            {known(arm.price) ? money(arm.price.value) : "—"}
          </span>
          <span className="eyebrow">{r.total > 0 ? `+${r.total}` : r.total} pts</span>
        </span>
      </button>

      {open && (
        <div className="border-t border-rule bg-surface-2 p-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="eyebrow mb-2" style={{ color: "var(--good)" }}>
                Counts for it
              </div>
              {pos.length ? (
                pos.map((l, i) => (
                  <div key={i} className="mb-1.5 flex gap-2.5 text-[13px] leading-snug">
                    <span className="num shrink-0 text-good">+{l.points}</span>
                    <span className="text-ink-2">{l.reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-[13px] text-ink-3">Nothing, on your answers.</div>
              )}
            </div>
            <div>
              <div className="eyebrow mb-2" style={{ color: "var(--bad)" }}>
                Counts against it
              </div>
              {neg.length ? (
                neg.map((l, i) => (
                  <div key={i} className="mb-1.5 flex gap-2.5 text-[13px] leading-snug">
                    <span className="num shrink-0 text-bad">{l.points}</span>
                    <span className="text-ink-2">{l.reason}</span>
                  </div>
                ))
              ) : (
                <div className="text-[13px] text-ink-3">Nothing, on your answers.</div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onPick(arm.id)}
              className="num rounded-sm border border-rule-strong px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] hover:border-accent hover:text-accent"
            >
              Full spec sheet
            </button>
            <span className="num inline-flex items-center gap-1.5 text-[11px] text-ink-3">
              price sourcing
              <ConfidenceMeter c={arm.price.confidence} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
