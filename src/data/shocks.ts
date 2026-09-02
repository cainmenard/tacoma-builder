import { S } from "./sources";
import type { Confidence, Fact, Gap, Shock, Source } from "./types";

/**
 * Shocks, added because the thread that produced the arm comparison asked for
 * the same treatment on dampers.
 *
 * Same rule as the arms: every value carries a source and a tier, and anything
 * nobody publishes is a gap rather than a plausible number.
 *
 * Two things about this dataset are worth saying out loud before you read it.
 *
 * First, the prices are not comparable across rows on their own. Some of these
 * are a front pair, one is four corners. The `covers` field says which, and the
 * table refuses to sort on price for that reason.
 *
 * Second, every one of these is sold both with and without adjusters, at a
 * different part number and a different price. That is the whole reason the
 * variants model exists, and it is why a single "price" for any of these is a
 * simplification the spec sheet undoes.
 */

const f = <T,>(value: T, confidence: Confidence, sources: Source[], note?: string): Fact<T> => ({
  value,
  confidence,
  sources,
  note,
});

const gap = (needed: string, sources: Source[] = [], note?: string): Gap => ({
  value: null,
  confidence: "gap",
  sources,
  needed,
  note,
});

export const SHOCKS: Shock[] = [
  {
    id: "bilstein-8112",
    brand: "Bilstein",
    model: "B8 8112 Zone Control",
    partNumber: gap("A Tacoma-specific 8112 part number. Retailers list the kit, not the number.", [S.wewBilstein]),
    blurb: "The long-service option. A hundred thousand miles between rebuilds is the number that decides this whole comparison if you drive a lot of pavement.",
    price: f(2199, "retailer", [S.wewBilstein], "Listed against a $2,530 regular price, so treat $2,199 as a sale rather than the street price."),
    priceRetailer: "Wheel Every Weekend",
    position: "front",
    covers: "Front pair only. The rear 8100s are a separate purchase.",
    bodyDiaIn: f(2.5, "retailer", [S.wewBilstein]),
    reservoir: f("remote", "retailer", [S.wewBilstein]),
    adjuster: f("none", "retailer", [S.wewBilstein], "The base 8112 is not adjustable on the truck. The DSA+ variant below is."),
    liftRangeIn: f([0.4, 2.2], "retailer", [S.wewBilstein]),
    travelIn: gap("A published shock travel figure.", [S.wewBilstein]),
    springRatesLbIn: gap("Published coil rate options. This is the heavier-truck question from the thread and Bilstein does not answer it in the listing.", [S.wewBilstein]),
    requiresUca: gap("Whether an aftermarket upper arm is required at full lift.", [S.wewBilstein]),
    rebuildIntervalMi: f([100000, 100000], "retailer", [S.wewBilstein], "A retailer's number, not Bilstein's, and it is roughly three times what the King listings claim. Worth confirming before it decides your purchase."),
    rebuildCost: gap("A published Bilstein rebuild price. The retailer offers 20% off services for the life of the shock but does not print a rate.", [S.wewBilstein]),
    warranty: gap("Bilstein's stated warranty term for this kit.", [S.wewBilstein]),
    fieldReports: [],
    variants: [
      {
        label: "8112, fixed valving",
        price: f(2199, "retailer", [S.wewBilstein]),
        changes: "Zone control valving set at the factory. Nothing to turn on the truck.",
      },
      {
        label: "8112 DSA+",
        price: gap("A price for the DSA+ pair.", [S.wewBilsteinDsa]),
        changes: "Adds click adjusters for high and low speed compression, plus an adjustable internal hydraulic bump stop.",
        adjuster: f("dual-speed", "retailer", [S.wewBilsteinDsa]),
      },
    ],
    gaps: [
      "Shock travel",
      "Published coil rate options",
      "Rebuild price",
      "Warranty terms",
      "Whether the 100,000-mile service claim comes from Bilstein or the seller",
    ],
  },
  {
    id: "fox-25-dsc",
    brand: "Fox",
    model: "2.5 Factory Race DSC",
    partNumber: f("880-06-418", "retailer", [S.toytecFox]),
    blurb: "Ten low speed clicks and twelve high speed. The most adjustment on the board, and it needs an aftermarket arm to fit.",
    price: f(2599.95, "retailer", [S.toytecFox]),
    priceRetailer: "ToyTec Lifts",
    position: "front",
    covers: "Front pair only.",
    bodyDiaIn: f(2.5, "retailer", [S.toytecFox]),
    reservoir: f("remote", "retailer", [S.toytecFox], "Smooth bore honed seamless alloy."),
    adjuster: f("dual-speed", "retailer", [S.toytecFox], "DSC, dual speed compression."),
    liftRangeIn: gap("A lift range in inches. The listing gives lengths, not lift.", [S.toytecFox], "Extended 21.810\", compressed 16.910\"."),
    travelIn: f(4.9, "retailer", [S.toytecFox]),
    springRatesLbIn: gap("Published coil rate options.", [S.toytecFox]),
    requiresUca: f(true, "retailer", [S.toytecFox], "Stated flatly on the listing: requires an upper control arm."),
    rebuildIntervalMi: gap("Any published rebuild interval from Fox.", [S.toytecFox]),
    rebuildCost: gap("A published Fox rebuild price."),
    warranty: gap("Fox's warranty term for this kit, in writing."),
    fieldReports: [],
    gaps: [
      "Lift range in inches",
      "Published coil rate options",
      "Rebuild interval",
      "Rebuild price",
      "Warranty terms",
    ],
  },
  {
    id: "icon-25-vs",
    brand: "ICON",
    model: "58735C 2.5 VS CDCV",
    partNumber: f("58735C", "manufacturer", [S.iconCoilover]),
    blurb: "The one the thread noted you can buy valved for a heavier spring without sending it back for a revalve.",
    price: f(2287.95, "manufacturer", [S.iconCoilover], "Offroad Alliance lists the same kit at $2,199.95."),
    priceRetailer: "ICON Vehicle Dynamics",
    position: "front",
    covers: "Front pair only.",
    bodyDiaIn: f(2.5, "manufacturer", [S.iconCoilover]),
    reservoir: f("remote", "manufacturer", [S.iconCoilover]),
    adjuster: f("compression", "manufacturer", [S.iconCoilover], "CDCV, ten points of adjustment."),
    liftRangeIn: f([0, 2.75], "manufacturer", [S.iconCoilover], "0 to 2.75 inches on a 2016-2023 truck. The 0-3.5 inch figure in the title is the 2005-2015 range."),
    travelIn: gap("A published travel figure in inches.", [S.iconCoilover]),
    springRatesLbIn: f([650, 700], "retailer", [S.iconCoilover], "Sold as separate part numbers, 58735C-650 and 58735C-700. This is the only shock here where a retailer prints the coil rate on the box."),
    requiresUca: gap("Whether the extended travel version needs an aftermarket arm.", [S.iconCoilover]),
    rebuildIntervalMi: gap("Any published rebuild interval from ICON.", [S.iconCoilover]),
    rebuildCost: gap("A published ICON rebuild price."),
    warranty: gap("ICON's warranty term for this kit."),
    fieldReports: [],
    variants: [
      {
        label: "58735C, standard coil",
        price: f(2287.95, "manufacturer", [S.iconCoilover]),
        changes: "The base kit with ICON's standard front coil.",
      },
      {
        label: "58735C-700, 700 lb coil",
        price: gap("A separate price for the 700 lb build.", [S.iconCoilover]),
        changes: "Ordered with a 700 lb/in coil for a heavier front end, which is the setup the thread said usually needs a revalve elsewhere.",
        partNumber: f("58735C-700", "retailer", [S.iconCoilover]),
      },
    ],
    gaps: ["Travel in inches", "Rebuild interval", "Rebuild price", "Warranty terms", "Price for the 700 lb build"],
  },
  {
    id: "king-25",
    brand: "King",
    model: "25001-119 Performance 2.5",
    partNumber: f("25001-119, or 25001-119A with adjusters", "retailer", [S.headstrongKing]),
    blurb: "The rebuild clock is the whole argument. Everything else about these is well liked and nobody disputes it.",
    price: f(1805, "retailer", [S.headstrongKing], "Headstrong lists $1,805 to $2,172.65 across the configurations, which is the adjuster and coil rate spread rather than a discount."),
    priceRetailer: "Headstrong Offroad",
    position: "front",
    covers: "Front pair only.",
    bodyDiaIn: f(2.5, "retailer", [S.headstrongKing]),
    reservoir: f("remote", "retailer", [S.headstrongKing]),
    adjuster: f("none", "retailer", [S.headstrongKing], "The base 25001-119 has no adjuster. The A suffix adds one."),
    liftRangeIn: gap("A published lift range.", [S.headstrongKing]),
    travelIn: gap("A published travel figure.", [S.headstrongKing]),
    springRatesLbIn: f([650, 700], "retailer", [S.headstrongKing], "Sold as -650 and -700 suffixes."),
    requiresUca: gap("Whether the extended travel version needs an aftermarket arm.", [S.headstrongKing]),
    rebuildIntervalMi: f([10000, 50000], "community", [S.shockSurplusKingFaq], "The spread is the point. A street truck can reach 50,000 miles; mixed use is quoted at 10,000 to 30,000. Racers are at 1,000 to 5,000, which is not the use case here."),
    rebuildCost: f(700, "community", [S.shockSurplusKingFaq], "Midpoint of a $600 to $800 range quoted for 2.5 shocks with reservoirs. Not King's own number."),
    rebuildNote: "At the pessimistic end of the interval this is the line item that overtakes the purchase price, which is what the thread's cost-of-ownership chart was showing.",
    warranty: gap("King's warranty term, in writing.", [S.shockSurplusKingFaq], "The Shock Surplus FAQ covers rebuilds and says nothing about warranty."),
    fieldReports: [
      {
        tone: "concern",
        text: "The rebuild interval is quoted by a retailer across a five-to-one range depending on use, and it is the only shock here where the recurring cost is large enough to change the ranking. Both the interval and the rebuild price are third-party numbers, not King's.",
        sources: [S.shockSurplusKingFaq],
      },
    ],
    variants: [
      {
        label: "25001-119",
        price: f(1805, "retailer", [S.headstrongKing]),
        changes: "Remote reservoir, no adjuster. Valving is fixed until it goes back.",
      },
      {
        label: "25001-119A",
        price: gap("A price for the adjuster version on its own.", [S.headstrongKing], "It sits somewhere inside the $1,805 to $2,172.65 spread with the coil rate options."),
        changes: "Adds the wide range compression adjuster, 20 clicks.",
        partNumber: f("25001-119A", "retailer", [S.headstrongKing]),
        adjuster: f("compression", "retailer", [S.headstrongKing]),
      },
    ],
    gaps: ["Lift range", "Travel", "Rebuild interval from King rather than a retailer", "Rebuild price from King", "Warranty terms", "Price of the adjuster option on its own"],
  },
  {
    id: "elka-25-dc",
    brand: "Elka",
    model: "LK90001 2.5 DC",
    partNumber: f("LK90001", "retailer", [S.toytecElka]),
    blurb: "Requested in the thread. Four corners in one price, which makes it look expensive next to the front-pair listings until you read what is in the box.",
    price: f(4039.98, "retailer", [S.toytecElka]),
    priceRetailer: "ToyTec Lifts",
    position: "front+rear",
    covers: "Four shocks, front and rear. Not comparable to the front-pair prices above without halving it, and even that is rough.",
    bodyDiaIn: f(2.5, "retailer", [S.toytecElka]),
    reservoir: f("remote", "retailer", [S.toytecElka], "External remote with a low-friction floating piston."),
    adjuster: f("dual-speed", "retailer", [S.toytecElka], "Listed as dual adjustable. Elka's own copy describes high and low speed compression on the DC reservoir model."),
    liftRangeIn: f([0, 2], "retailer", [S.toytecElka]),
    travelIn: gap("A published travel figure.", [S.toytecElka]),
    springRatesLbIn: gap("Published coil rate options.", [S.toytecElka]),
    requiresUca: gap("Whether an aftermarket upper arm is required.", [S.toytecElka]),
    rebuildIntervalMi: gap("Any published rebuild interval.", [S.toytecElka]),
    rebuildCost: gap("A published rebuild price. Elka describes the shocks as fully rebuildable with affordable replacement parts and prints no figure.", [S.toytecElka]),
    warranty: gap("Elka's warranty term for this kit."),
    fieldReports: [],
    gaps: ["Travel", "Published coil rate options", "Rebuild interval", "Rebuild price", "Warranty terms"],
  },
  {
    id: "ride-25-dpa",
    brand: "Ride",
    model: "2.5 DPA",
    partNumber: gap("A part number. AccuTune sells it inside a kit rather than as a listed shock.", [S.accutuneRide]),
    blurb: "Requested in the thread. Sold through a tuner rather than off a shelf, and the only one here that includes a free revalve after you have driven it.",
    price: gap("A price for the shocks on their own. AccuTune lists them inside a Stage 3A kit that also carries an upper arm, springs, bump stops and a u-bolt flip, so the kit price is not a shock price.", [S.accutuneRide]),
    position: "front+rear",
    covers: "Front coilovers and rear shocks, sold inside a larger kit.",
    bodyDiaIn: f(2.5, "retailer", [S.accutuneRide]),
    reservoir: gap("Whether these carry a reservoir.", [S.accutuneRide]),
    adjuster: f("dual-speed", "retailer", [S.accutuneRide], "DPA, dual piston adjuster, independent high and low speed compression."),
    liftRangeIn: f([1.5, 2], "retailer", [S.accutuneRide], "Front coilover figure. The rear shocks are listed at 1 to 2.5 inches."),
    travelIn: gap("A published travel figure.", [S.accutuneRide]),
    springRatesLbIn: gap("Coil rates in lb/in. AccuTune sells by weight range rather than by rate, which is a different way of answering the same question and cannot be compared to a number.", [S.accutuneRide]),
    requiresUca: f(true, "retailer", [S.accutuneRide], "The Stage 3A kit includes an AccuTune tubular upper arm."),
    rebuildIntervalMi: gap("Any published rebuild interval.", [S.accutuneRide]),
    rebuildCost: gap("A published rebuild price.", [S.accutuneRide], "One free revalve is included with the kit, which is not the same thing as a rebuild."),
    warranty: gap("A published warranty term."),
    fieldReports: [
      {
        tone: "mixed",
        text: "Sold configured by weight range rather than by published spring rate. That is arguably the better answer to the heavier-truck problem the thread raised, and it also means there is no number here to put next to the others.",
        sources: [S.accutuneRide],
      },
    ],
    gaps: [
      "A price for the shocks on their own",
      "Part number",
      "Whether they carry a reservoir",
      "Travel",
      "Coil rates in lb/in",
      "Rebuild interval",
      "Rebuild price",
      "Warranty terms",
    ],
  },
];

export const SHOCKS_BY_ID = Object.fromEntries(SHOCKS.map((s) => [s.id, s]));
