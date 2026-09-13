window.THREEB_START_CONFIG = {
  version: 7, release: "14",
  terminology: {
    pattern: { key: "LKL", en: "long-short-long", nl: "lang-kort-lang" },
    line: { en: "Line", nl: "Lijn" },
    part: { en: "Part", nl: "Deel" },
    firstLine: { en: "Line 1 · departure line", nl: "Lijn 1 · afstootlijn" }
  },
  defaultLanguage: "en", defaultTableMode: "groot", defaultDirection: "west", defaultDeparture: "neus",
  tables: {
    klein: { labels: { en: "Small", nl: "Klein" }, widthCm: 115, heightCm: 230, dotOffsetCm: 9.5 },
    groot: { labels: { en: "Large", nl: "Groot" }, widthCm: 142, heightCm: 284, dotOffsetCm: 9.5 }
  },
  ballDiameterMm: 61.5,
  drawing: {
    routeWidth: "scaled_ball_diameter",
    guideLineWidthSvg: 2,
    ballsAtCushion: true,
    balls: {
      defaultColor: "white",
      colors: {
        white: { fill: "#fffdf4", spot: "#d83a2f" },
        yellow: { fill: "#f4d13d", spot: "#d83a2f" }
      },
      defaultMarking: "spotted",
      markings: ["plain", "spotted"],
      outline: "#3a2a1c",
      outlineWidthSvg: 1.2
    },
    departureBall: {
      draggable: true,
      storage: "per_table_pattern_and_shot_view",
      minimumGapBallDiameters: 0.25,
      precisionStepCm: 1,
      keyboardArrows: true,
      mobileButtons: true
    },
    guideToDiamondLineAtDeparture: true,
    guideToDiamondLineAtArrival: true,
    arrows: false,
    valueLabels: {
      defaultMode: "bij_lijntje",
      modes: ["bij_lijntje", "vervang_dichtstbijzijnde_nummer"],
      showPartName: false,
      showPointType: false,
      suppressNearestTenInReplacementMode: true
    }
  },
  shotLines: ["VIJF","ZES","ZEVEN","ACHT","NEGEN","TIEN","ELF","TWAALF"],
  patternByLine: { VIJF:"LKL", ZES:"LKL", ZEVEN:"LKL", ACHT:"LKL" },
  patternLabels: {
    VIJF:{en:"FIVE",nl:"VIJF"}, ZES:{en:"SIX",nl:"ZES"}, ZEVEN:{en:"SEVEN",nl:"ZEVEN"}, ACHT:{en:"EIGHT",nl:"ACHT"},
    NEGEN:{en:"NINE",nl:"NEGEN"}, TIEN:{en:"TEN",nl:"TIEN"}, ELF:{en:"ELEVEN",nl:"ELF"}, TWAALF:{en:"TWELVE",nl:"TWAALF"}
  },
  parts: [
    {key:"neus",labels:{en:"Nose",nl:"Neus"},color:"#1778d4"},
    {key:"kop",labels:{en:"Head",nl:"Kop"},color:"#ee6b2f"},
    {key:"nek",labels:{en:"Neck",nl:"Nek"},color:"#8654c7"},
    {key:"romp",labels:{en:"Body",nl:"Romp"},color:"#15966f"},
    {key:"kruis",labels:{en:"Cross",nl:"Kruis"},color:"#db3f64"},
    {key:"been",labels:{en:"Leg",nl:"Been"},color:"#d5a21d"}
  ],
  departureOptions: ["neus","kop"],
  fixedPartBands: {
    neus:{from:"Z",to:"west"}, kop:{from:"west",to:"noord"},
    nek:{from:"noord",to:"oost"}, romp:{from:"oost",to:"zuid"},
    kruis:{from:"zuid",to:"west"}, been:{from:"west",to:"noord"}
  },
  lklValueRanges: {
    defaultOffset:{V:20,A:5}, wrap:true, integerStep:1,
    overrides:{VIJF:{nek:{V:{minimum:13,maximum:18}}}}
  },
  shortenedFourCushionCorrection: {
    status: "indicative_without_experience_data",
    defaultMode: "advies",
    modes: ["aan","uit","advies"],
    effectType: "running_english",
    baseEffectPercent: 80,
    headLength: {
      unit: "cm",
      calculation: "euclidean_distance_between_head_V_and_A_on_diamond_lines",
      diamondToCushionCm: 9.5,
      referenceLengthCm: 140,
      stepCm: 25,
      percentagePointsPerStep: 2,
      minimumCorrectionPercentagePoints: -10,
      maximumCorrectionPercentagePoints: 10,
      roundEffectToPercentagePoints: 1
    },
    effectLimitsPercent: { minimum: 65, maximum: 100 }
  },
  defaults: {
    klein:{VIJF:{
      neus:{from:{kind:"acquit",value:"Z"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:38},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:15},to:{band:"oost",value:30}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}}
    }},
    groot:{VIJF:{
      neus:{from:{kind:"acquit",value:"Z"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:38},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:15},to:{band:"oost",value:30}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}}
    }}
  }
};
