# Tacoma UCA Index

Interactive buyer's guide for 3rd gen Toyota Tacoma (2016-2023) upper control arms.
Fourteen arms, four questions to a shortlist, and a cost model you run on your own miles.

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

    manufacturer  published by the company that makes the part
    retailer      a seller listing
    community     forum reports, independent reviews, tuner write-ups
    estimate      the original thread analysis, not independently verified
    gap           nobody publishes this

63 fields across 14 arms currently sit in the gap tier. That count is the point.

## Sections

| Section | What it does |
|---|---|
| Matcher | Four questions produce a scored, auditable shortlist |
| Compare | Sortable, filterable table; pin up to 3 for side-by-side. The knuckle joint and the frame-side pivot are separate columns |
| Cost | Purchase + grease + joint replacement + alignments over your mileage and rates |
| Charts | One metric at a time, bars colored by sourcing strength |
| Gaps | Every unpublished spec, grouped by what would close it |

## Repo layout

The Next.js 15 / React 19 / TypeScript / Tailwind v4 source lives at the repo root.
Vercel builds it on every push to `main`.

    src/data/sources.ts   every cited URL, in one auditable place
    src/data/types.ts     the Fact / Gap model that forces sourcing
    src/data/arms.ts      the 14 arms
    src/lib/match.ts      matcher scoring rules
    src/lib/tco.ts        cost model

`docs/index.html` is a standalone mirror: the whole app compiled into one
self-contained file with no build step, served by GitHub Pages. It goes stale the
moment `src/data/arms.ts` changes, so regenerate it in the same commit:

    npm run build:mirror

That script (`scripts/build-mirror.mjs`) bundles the app with esbuild, runs the
Tailwind CLI over `src/app/globals.css`, and wraps both in `scripts/mirror-shell.html`.

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
