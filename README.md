# Tacoma UCA Index

Interactive buyer's guide for 3rd gen Toyota Tacoma (2016-2023) suspension.
Fourteen upper control arms and six shocks, four questions to a shortlist, and a cost
model you run on your own miles.

**Live:** https://tacoma-builder.vercel.app (Vercel, builds from source on every push)
**Mirror:** https://cainmenard.github.io/tacoma-builder/ (GitHub Pages, serves the prebuilt single file from `/docs`)

Built from [N64_Wallmaster's TacomaWorld comparison](https://www.tacomaworld.com/threads/what-are-the-best-upper-control-arms-for-you-semi-engineering-level-comparison-for-3rd-gen.869334/)
plus what the thread asked for: caster angle (Saskabush), the Toyota TRD arm (FunknNasty),
JD Fabrication and the SPC cost-of-ownership question (wi_taco).

## The rule this is built on

Every field carries a source URL and a confidence tier. Nothing is estimated into
existence. Where research could not find a figure, the field is a gap, the UI says so,
and it goes on a public list instead of being filled with something plausible.

That rule is why there is no ride-quality or NVH score anywhere in this app. Nobody
publishes a measurement for any of these arms. What is published is the pivot at each
end of the arm, so both ends are recorded — `jointName` / `jointFamily` for the joint at
the knuckle, `framePivotName` / `framePivotFamily` for the bushing at the frame — and the
ride conclusion is left to the reader.

    independent-test  somebody measured it on a truck and published the method
    manufacturer      published by the company that makes the part
    retailer          a seller listing
    community         forum reports, independent reviews, tuner write-ups
    estimate          the original thread analysis, not independently verified
    gap               nobody publishes this

Zero fields currently sit in the top tier. That is not a research backlog, it is
the state of the market: nobody publishes a measured figure for any of these arms.
The tier exists so that when a back-to-back test does get published, it outranks
the marketing copy instead of sitting next to it.

97 fields across 14 arms and 6 shocks currently sit in the gap tier. That count is the point.

## Sections

| Section | What it does |
|---|---|
| Matcher | Four questions produce a scored, auditable shortlist |
| Compare | Sortable, filterable table; pin up to 3 for side-by-side. The knuckle joint and the frame-side pivot are separate columns |
| Cost | Purchase + grease + joint replacement + alignments over your mileage and rates |
| Charts | One metric at a time, bars colored by sourcing strength |
| Shocks | Six coilovers on the same rules. Rebuild interval, adjuster configurations, coil rates |
| Gaps | Every unpublished spec across both, grouped by what would close it |

## Repo layout

The Next.js 15 / React 19 / TypeScript / Tailwind v4 source lives at the repo root.
Vercel builds it on every push to `main`.

    src/data/sources.ts   every cited URL, in one auditable place
    src/data/types.ts     the Fact / Gap model that forces sourcing
    src/data/arms.ts      the 14 arms
    src/data/shocks.ts    the 6 shocks
    src/lib/match.ts      matcher scoring rules
    src/lib/tco.ts        cost model, arms and shocks

`docs/index.html` is a standalone mirror: the whole app compiled into one
self-contained file with no build step, served by GitHub Pages. It goes stale the
moment `src/data/arms.ts` changes, so regenerate it in the same commit:

    npm run build:mirror

That script (`scripts/build-mirror.mjs`) bundles the app with esbuild, runs the
Tailwind CLI over `src/app/globals.css`, and wraps both in `scripts/mirror-shell.html`.

Shocks live in `src/data/shocks.ts` as their own `Shock` interface rather than one
polymorphic Product type. Almost nothing they publish overlaps with an arm: an arm
has caster and a joint, a shock has travel, valving and a rebuild clock. They share
the sourcing model, the meter, the gap board and the cost model, which is the right
amount of sharing.

Two things about the shock data are deliberate. Shock price is not sortable, because
some listings are a front pair and some are four corners, so the column would not
compare. And every shock in the set is sold both with and without adjusters at a
different part number, which is what the `variants` model below is for.

A part sold in more than one configuration gets a `variants` array rather than a
second row, so it is not double-counted in the charts. A variant may
override any field the option actually changes. JD Fabrication is the worked
example: the $949.99 build swaps rubber inner bushings for sealed uniballs.

To add an arm, append to `ARMS` in `src/data/arms.ts`, add its URLs to `S` in
`src/data/sources.ts`, and list what you could not source in its `gaps` array.
Charts, filters, the gap board and the cost model all pick it up automatically.
To close a gap, swap the `gap(...)` call for `f(value, tier, [source])`.

    npm install
    npm run dev

## Disclaimer

Independent analysis. Prices and specs change. Manufacturer figures are marketing until
somebody measures them, and forum reports are a selection-biased sample. Confirm with the
manufacturer before spending money.
