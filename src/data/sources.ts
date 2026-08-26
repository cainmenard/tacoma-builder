import type { Source } from "./types";

/** Every URL cited anywhere in the app, in one place, so links can be audited. */
export const S = {
  apacheProduct: {
    label: "Apache Offroad product page",
    url: "https://apacheoffroad.com/product/pre-order-apache-offroad-upper-control-arm-pair-w-aluminum-caps-2005-2023-toyota-tacoma/",
    quote: "Provides 3 degrees of caster",
  },
  teqCustomsApache: {
    label: "TEQ Customs",
    url: "https://teqcustoms.com/products/apache-offroad-uca-05-23-tacoma",
  },
  jbaProduct: {
    label: "JBA Offroad product page",
    url: "https://jbaoffroad.com/jba-std-high-caster-upper-a-arms-for-toyota-tacoma-05-plus",
    quote:
      "designed with added caster to aid in retaining factory alignment specs when aftermarket lift kits are installed",
  },
  jbaPricing: { label: "JBA Offroad, Tacoma UCA listing", url: "https://jbaoffroad.com/upper-control-arms/toyota/tacoma-05" },
  trailTacomaJba: {
    label: "Trail Tacoma, JBA HD review",
    url: "https://trailtacoma.com/review/jba-hd-high-caster-uca-2nd-3rd-gen/",
    quote: "these control arms offer three more degrees of caster",
  },
  spcProduct: {
    label: "SPC Performance 25470",
    url: "https://www.spcalignment.com/index.php/product/25470",
    quote: "0° to +4° of caster … ±2° of camber",
  },
  spcInstall: {
    label: "SPC 25470 install sheet (PDF)",
    url: "http://www.spcalignment.com/instructions/25470-INS_Grease_WEB.pdf",
    quote: "Using the star plate, caster change can be adjusted from +0.0° to +4.0°",
  },
  spcWarranty: {
    label: "SPC warranty terms",
    url: "https://www.spcalignment.com/page/warranties",
    quote:
      "Consumables (such as ball joints and bushings) that are contained in control arms with limited lifetime warranties are subject to a three (3) year or 36,000 miles (whichever occurs first) warranty.",
  },
  spcBallJointKit: {
    label: "SPC 35101 ball joint kit",
    url: "https://store.specprod.com/item/35101/REPLACEMENT-BALL-JOINT-KIT/",
  },
  spcXaxisKit: {
    label: "SPC 25022 xAxis bushing kit",
    url: "https://store.specprod.com/item/25022/XAXIS-BUSHING-UPGRADE-KIT/",
  },
  spcPrice: {
    label: "The Yota Garage",
    url: "https://theyotagarage.com/spc-upper-control-arms-2023-2016-toyota-tacoma-25470",
  },
  adventureTaco1: {
    label: "AdventureTaco, replacing SPC UCAs",
    url: "https://adventuretaco.com/replacing-my-spc-upper-control-arms-with-spc-ucas/",
    quote:
      "it took almost exactly two years for my never-to-be-serviced-again, 'lifetime joint' upper control arms to wear out",
  },
  adventureTaco2: {
    label: "AdventureTaco, reverting to poly bushings",
    url: "https://adventuretaco.com/reverting-my-spc-upper-control-arms-to-poly-bushings/",
  },
  ih8mudSpc: {
    label: "IH8MUD, early failure of SPC UCA ball joints",
    url: "https://forum.ih8mud.com/threads/early-failure-of-spc-uca-ball-joints.1325172/",
  },
  t4rSpc: {
    label: "Toyota-4Runner.org, failing SPC ball joints after 2 years",
    url: "https://www.toyota-4runner.org/5th-gen-t4rs/316091-failing-spc-uca-ball-joints-after-2-years.html",
  },
  twSpc20k: {
    label: "TacomaWorld, SPC UCA bad ball joints after 20k",
    url: "https://www.tacomaworld.com/threads/spc-uca-bad-ball-joints-after-20k.766784/",
  },
  omeProduct: {
    label: "ARB / Old Man Emu UCA0005",
    url: "https://store.arbusa.com/upper-control-arms-uca0005/",
    quote: "Increased Camber and Caster for 50mm Lift",
  },
  omeFitting: {
    label: "OME UCA0005 fitting instructions (PDF)",
    url: "https://store.arbusa.com/content/Fitting_Instruction_37800040_UCA0005_TACOMA.pdf",
  },
  shockSurplus: {
    label: "Shock Surplus UCA comparison guide",
    url: "https://www.shocksurplus.com/blogs/shocks-101/the-definitive-upper-control-arm-comparison-guide",
  },
  iconTubular: {
    label: "ICON 58450DJ",
    url: "https://iconvehicledynamics.com/products/58450dj",
    quote: "engineered with built-in caster correction for optimal alignment specifications",
  },
  iconBillet: { label: "ICON 58550DJ", url: "https://iconvehicledynamics.com/products/58550dj" },
  iconInstall: {
    label: "ICON 58550DJ install sheet (PDF)",
    url: "https://images.iconfigurators.app/pdf/I58550DJ_REVB_2327.pdf",
    quote:
      "ALL ICON UPPER CONTROL ARMS HAVE BEEN ENGINEERED TO ALLOW FOR THE MOST POSSIBLE CASTER, WHILE STILL ALLOWING THE VEHICLE TO BE PROPERLY ALIGNED",
  },
  dobinsonsSteelRetail: {
    label: "Alldogs Offroad, UCA59-003K",
    url: "https://www.alldogsoffroad.com/dobinsons-uca59-003k-tubular-upper-control-arms-05-18-toyota-tacoma",
    quote: "Has 3 degrees of caster built in, no adjustability or settings required",
  },
  dobinsonsSteelPrice: {
    label: "ExtremeTerrain",
    url: "https://www.extremeterrain.com/dobinsons-tacoma-front-upper-control-arms-uca59-003k.html",
  },
  dobinsonsAlu: {
    label: "Dobinsons UCA59-203K",
    url: "https://dobinsons.com/ineos/toy-121_front_upper-control-arm_uca59-203k-detail",
    quote: "Must Fit When Raising Vehicle Above 50mm To Allow For Improved Caster Angle Alignment",
  },
  exitOffroadDobinsons: {
    label: "Exit Offroad, Dobinsons billet",
    url: "https://exitoffroad.com/product/dobinsons-billet-aluminum-ucas-toyota-tacoma/",
    quote:
      "Having adjustable ends on the arms, where it attaches to the frame, your alignment shop can dial in the perfect amount of added caster and camber",
  },
  dirtKing4130: {
    label: "Dirt King 4130 UCAs",
    url: "https://dirtking.com/products/4130-upper-control-arms-dk-812993",
    quote: "Improved caster and pivot angles deliver better handling and control with up to 3\" of lift",
  },
  dirtKingBillet: {
    label: "Dirt King billet UCAs",
    url: "https://dirtking.com/products/billet-upper-control-arms-dk-811923",
    quote: "Adjustable inner pivot system for camber and caster adjustments",
  },
  camburgXJoint: {
    label: "TotalZParts, Camburg X-Joint",
    url: "https://www.totalzparts.com/product/camburg-x-joint-front-upper-control-arms-05-23-toyota-tacoma-prerunner-4wd/",
    quote: "increasing much needed caster compared to stock arms",
  },
  camburgXL: {
    label: "TeqSport, Camburg X-Joint XL",
    url: "https://www.teqsport.com/upgraded-front-control-arms/camburg/05-15-tacoma-camburg-performance-joint-xl-upper-control-arm-kit-p-68243.html",
    quote: "We build more caster and change the camber curve to correct geometry",
  },
  camburgSite: {
    label: "Camburg, X-Joint XL kit CAM-310200",
    url: "https://www.camburg.com/products/camburg-engineering-2005-2023-toyota-tacoma-pre-4wd-performance-x-joint-xl-upper-control-arm-kit-cam-310200",
  },
  trdToyota: {
    label: "Toyota, TRD Upper Control Arm PT901-35230",
    url: "https://autoparts.toyota.com/products/product/trd-upper-control-arm-pt90135230",
  },
  trdPartsDeal: {
    label: "ToyotaPartsDeal PT901-35230",
    url: "https://www.toyotapartsdeal.com/oem/toyota~taco~sus~arm~assy~fn~pt901-35230.html",
  },
  trdPressRelease: {
    label: "Toyota press release, 2022 Tacoma TRD Pro",
    url: "https://www.prnewswire.com/news-releases/next-generation-tacoma-trd-pro-takes-off-road-performance-up-a-notch-301302168.html",
    quote: "Machine-forged aluminum construction",
  },
  trdOlathe: {
    label: "Olathe Toyota PT901-35220-RH",
    url: "https://parts.olathetoyota.com/oem-parts/toyota-trd-tacoma-suspension-arm-assembly-upper-right-hand-pt90135220rh",
    quote: "Same Upper Control Arms As Found In The TRD Pro Package",
  },
  trdStockArm: {
    label: "OEM Parts Online, stock UCA 48630-04021",
    url: "https://toyota.oempartsonline.com/oem-parts/toyota-upper-control-arm-4863004021",
  },
  twTrdThread: {
    label: "TacomaWorld, OEM TRD Pro upper control arms",
    url: "https://www.tacomaworld.com/threads/oem-trd-pro-upper-control-arms.847722/",
  },
  jdFab: {
    label: "JD Fabrication, Tacoma 2016+ upper arm",
    url: "https://jdfabrication.com/products/tacoma-2016-upper-arm",
    quote: "Our powder coated upper arms are made from 1.5\" x .120 DOM steel.",
  },
  jdFabReturns: { label: "JD Fabrication return policy", url: "https://jdfabrication.com/policies/refund-policy" },
  trailTacomaJdFab: {
    label: "Trail Tacoma, JD Fab long travel overview",
    url: "https://trailtacoma.com/3rd-gen/jd-fabrication-2-25-long-travel-kit-tacoma-overview/",
  },
  offroadElements: {
    label: "Off Road Elements, JD Fab UCAs",
    url: "https://www.offroadelements.com/jd-fabrication-upper-arms-tacoma-2016-2023/",
  },
  originalThread: {
    label: "N64_Wallmaster's original TacomaWorld analysis",
    url: "https://www.tacomaworld.com/threads/what-are-the-best-upper-control-arms-for-you-semi-engineering-level-comparison-for-3rd-gen.869334/",
  },
  ucaMasterList: {
    label: "TacomaWorld, complete list of UCAs for the 3rd gen",
    url: "https://www.tacomaworld.com/threads/complete-list-of-ucas-for-the-3rd-gen-tacoma.738745/",
  },
} satisfies Record<string, Source>;
