"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Matcher } from "@/components/Matcher";
import { CompareTable } from "@/components/CompareTable";
import { SideBySide } from "@/components/SideBySide";
import { SpecSheet } from "@/components/SpecSheet";
import { CostCalculator } from "@/components/CostCalculator";
import { MetricBoard } from "@/components/Charts";
import { Gaps } from "@/components/Gaps";
import { SectionHead } from "@/components/Primitives";
import { CasterStrip } from "@/components/CasterStrip";
import { ShockTable } from "@/components/ShockTable";
import { ShockCost } from "@/components/ShockCost";
import { ARMS, fieldsAtTier } from "@/data/arms";
import { SHOCKS } from "@/data/shocks";
import { known } from "@/data/types";
import { S } from "@/data/sources";

const NUMWORD: Record<number, string> = {
  6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
  11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen",
};

export default function Page() {
  const [open, setOpen] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string[]>([]);

  const togglePin = (id: string) =>
    setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? [...p.slice(1), id] : [...p, id]));

  const noCaster = ARMS.filter((a) => !known(a.casterDeg)).length;
  const measured = fieldsAtTier("independent-test", [...ARMS, ...SHOCKS]);
  const prices = ARMS.filter((a) => known(a.price)).map((a) => a.price.value as number);

  return (
    <>
      <Header />

      {/* ---------- Hero: the caster gap, stated as a number ---------- */}
      <section id="top" className="grid-paper border-b border-rule-strong">
        <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="eyebrow">3rd gen Tacoma · 2016–2023 · upper control arms and shocks</div>
          <h1 className="display mt-3 max-w-[19ch] text-[clamp(1.9rem,5.2vw,3.5rem)]">
            {NUMWORD[ARMS.length]} arms. {NUMWORD[noCaster]} of them will not tell you how much caster you get.
          </h1>

          <CasterStrip />
          <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-ink-2">
            Caster correction is the reason most people buy aftermarket arms, and {noCaster} of the {ARMS.length} arms here
            publish no figure for it at all. This tool ranks arms against your setup, shows you what every number cost to
            source, and lists what nobody publishes instead of filling it in with something that sounds right.
          </p>

          <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
            <Stat n={`${ARMS.length}`} l="arms compared" />
            <Stat n={`${SHOCKS.length}`} l="shocks compared" />
            <Stat n={`$${Math.min(...prices)}–$${Math.max(...prices).toLocaleString()}`} l="street price range, Aug 2026" />
            <Stat n={`${noCaster}`} l="with no published caster figure" accent />
            <Stat n={`${[...ARMS, ...SHOCKS].reduce((n, p) => n + p.gaps.length, 0)}`} l="specs nobody publishes" accent />
            <Stat n={`${measured}`} l="figures anybody has measured on a truck" accent />
          </div>

          <div className="mt-9 flex flex-wrap gap-2">
            <a
              href="#matcher"
              className="num rounded-sm border border-accent bg-accent px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-accent-ink"
            >
              Find my arms
            </a>
            <a
              href="#table"
              className="num rounded-sm border border-rule-strong px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] hover:border-accent hover:text-accent"
            >
              Skip to the table
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1180px] space-y-16 px-4 py-14 sm:px-6 sm:py-16">
        <section>
          <SectionHead
            id="matcher"
            index="01"
            title="Four questions"
            lede="Lift height, duty cycle, budget, and whether you will actually pick up a grease gun. Those four answers eliminate most of this market before you read a single spec."
          />
          <div className="mt-7">
            <Matcher onPick={setOpen} />
          </div>
        </section>

        <section>
          <SectionHead
            id="table"
            index="02"
            title="Every arm, every number, every source"
            lede="Sort it, filter it, pin up to three for a side-by-side. Every arm has two pivots and they are listed separately: the joint at the knuckle, which is what the marketing is about, and the bushing at the frame, which is what you hear. The small bar next to each figure is how well sourced it is: five bars means somebody measured it on a truck and published how, four means the manufacturer said so, one means it came out of the original thread analysis and nobody has checked it."
          />
          <div className="mt-7">
            <CompareTable pinned={pinned} onTogglePin={togglePin} onOpen={setOpen} />
            <SideBySide ids={pinned} onClear={() => setPinned([])} onRemove={(id) => togglePin(id)} />
          </div>
        </section>

        <section>
          <SectionHead
            id="cost"
            index="03"
            title="What it costs on your miles"
            lede="Purchase price is the smallest decision you make here. Set your own mileage, labor rate, and how long you think the joints last, and the ranking reshuffles. SPC's own warranty caps the wear parts at 36,000 miles, which is the one place this stops being a guess."
          />
          <div className="mt-7">
            <CostCalculator />
          </div>
        </section>

        <section>
          <SectionHead
            id="shocks"
            index="04"
            title="Shocks, same rules"
            lede="Requested in the shock thread. Every one of these is sold both with and without adjusters, at a different part number, so the price on the left is one configuration and the sheet underneath shows the rest. Rebuild interval is the number that decides this category, and five of the six do not publish one."
          />
          <div className="mt-7">
            <ShockTable />
          </div>
          <div className="mt-7">
            <div className="eyebrow mb-2.5">What the rebuild clock costs over your miles</div>
            <ShockCost />
          </div>
        </section>

        <section>
          <SectionHead
            id="charts"
            index="05"
            title="One metric at a time"
            lede="Bars are colored by how well sourced the number is, not by rank. Hatched means nothing published at all, and on the caster chart that is most of the board."
          />
          <div className="mt-7">
            <MetricBoard />
          </div>
        </section>

        <section>
          <SectionHead
            id="gaps"
            index="06"
            title="What we still do not know"
            lede="Everything the research could not source, grouped by what would close it. This list shrinks when somebody who owns a set posts their alignment printout."
          />
          <div className="mt-7">
            <Gaps />
          </div>
        </section>

        <section className="border-t border-rule-strong pt-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="eyebrow mb-2">How to read this</div>
              <p className="max-w-[58ch] text-[14px] leading-relaxed text-ink-2">
                Nothing here is a dyno sheet. Manufacturer figures are marketing until somebody measures them, forum reports
                are a selection-biased sample because nobody starts a thread to say their arms still work, and the
                articulation and weight numbers all trace to one person&apos;s analysis rather than a scale and a protractor.
                There is a tier above &ldquo;the manufacturer says so&rdquo; for a figure somebody measured on a truck and
                published the method for, and right now {measured} of the fields on this board qualify. That is the honest
                state of this market, not a gap in the research.
                Nobody publishes an NVH or ride-quality measurement for any arm on this list, so there is no ride column
                and no quietness score here: what the frame-side pivot is made of is as close as the published data gets,
                and the conclusion from there is yours to draw.
                The sourcing meters exist so you can see which is which before you spend a thousand dollars.
              </p>
            </div>
            <div>
              <div className="eyebrow mb-2">Built from</div>
              <div className="space-y-1.5 text-[13px]">
                <a href={S.originalThread.url} target="_blank" rel="noopener noreferrer" className="block text-ink-2 underline decoration-rule-strong underline-offset-2 hover:text-accent">
                  N64_Wallmaster&apos;s original comparison on TacomaWorld
                </a>
                <a href={S.ucaMasterList.url} target="_blank" rel="noopener noreferrer" className="block text-ink-2 underline decoration-rule-strong underline-offset-2 hover:text-accent">
                  The complete UCA list thread
                </a>
                <p className="pt-1 text-ink-3">
                  TRD and JD Fab were added because FunknNasty and wi_taco asked for them. Caster went in because Saskabush
                  pointed out it was the whole reason people shop for these. The SPC cost-of-ownership argument is
                  wi_taco&apos;s, and his own warranty page backs him up better than his phrasing did.
                </p>
              </div>
            </div>
          </div>
          <p className="eyebrow mt-8">
            Independent analysis · prices and specs change · always confirm with the manufacturer before buying
          </p>
        </section>
      </main>

      <SpecSheet id={open} onClose={() => setOpen(null)} />
    </>
  );
}

function Stat({ n, l, accent }: { n: string; l: string; accent?: boolean }) {
  return (
    <div>
      <div className="num text-[clamp(1.4rem,3.4vw,2rem)] font-bold" style={{ color: accent ? "var(--accent)" : undefined }}>
        {n}
      </div>
      <div className="eyebrow mt-0.5 max-w-[22ch]">{l}</div>
    </div>
  );
}
