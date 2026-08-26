# Tacoma UCA Index

Interactive buyer's guide for 3rd gen Toyota Tacoma (2016-2023) upper control arms.
Fourteen arms, four questions to a shortlist, and a cost model you run on your own miles.

**Live:** https://cainmenard.github.io/tacoma-builder/

Built from [N64_Wallmaster's TacomaWorld comparison](https://www.tacomaworld.com/threads/what-are-the-best-upper-control-arms-for-you-semi-engineering-level-comparison-for-3rd-gen.869334/)
plus what the thread asked for: caster angle (Saskabush), the Toyota TRD arm (FunknNasty),
JD Fabrication and the SPC cost-of-ownership question (wi_taco).

## The rule this is built on

Every field carries a source URL and a confidence tier. Nothing is estimated into
existence. Where research could not find a figure, the field is a gap, the UI says so,
and it goes on a public list instead of being filled with something plausible.

    manufacturer  published by the company that makes the part
    retailer      a seller listing
    community     forum reports, independent reviews, tuner write-ups
    estimate      the original thread analysis, not independently verified
    gap           nobody publishes this

61 fields across 14 arms currently sit in the gap tier. That count is the point.

## Sections

| Section | What it does |
|---|---|
| Matcher | Four questions produce a scored, auditable shortlist |
| Compare | Sortable, filterable table; pin up to 3 for side-by-side |
| Cost | Purchase + grease + joint replacement + alignments over your mileage and rates |
| Charts | One metric at a time, bars colored by sourcing strength |
| Gaps | Every unpublished spec, grouped by what would close it |

## Repo layout

`docs/index.html` is the deployed build: the whole app compiled into one
self-contained file, no build step, no server. GitHub Pages serves it from `/docs`.

The Next.js 15 / React 19 / TypeScript / Tailwind v4 source that produces it lives in
the project zip; it drops into the repo root without disturbing `docs/`.

## Disclaimer

Independent analysis. Prices and specs change. Manufacturer figures are marketing until
somebody measures them, and forum reports are a selection-biased sample. Confirm with the
manufacturer before spending money.
