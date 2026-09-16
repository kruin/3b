window.THREEB_START_CONFIG = {
  version: 39, release: "46",
  terminology: {
    pattern: { key: "LKL", en: "long-short-long", nl: "lang-kort-lang" },
    line: { en: "Line", nl: "Lijn" },
    part: { en: "Part", nl: "Deel" },
    firstLine: { en: "Line 1 · departure line", nl: "Lijn 1 · afstootlijn" }
  },
  defaultLanguage: "en", defaultTableMode: "groot", defaultDirection: "west", defaultDeparture: "neus",
  editor: {
    defaultMode: "basis",
    modes: ["basis","alle"],
    lklBasicParts: ["neus","romp"],
    compactBallValueEditor: true,
    liveUpdate: true,
    openGesture: "double_click_or_double_tap"
  },
  explanation: {
    version: "0.2",
    defaultLevel: "LKL",
    scopeRules: {
      systemExplanation: "shared_large_and_small",
      lineExplanation: "one_line_one_table",
      requiredLineFields: ["line","table","snapshot"]
    },
    levels: [
      {
        key: "LKL",
        order: 1,
        tables: ["groot","klein"],
        labels: { en: "Level 1 · LKL", nl: "Level 1 · LKL" },
        description: {
          en: "The first application of the line system.",
          nl: "De eerste toepassing van het lijnensysteem."
        },
        slides: [
          {
            key: "why",
            title: { en: "Why 3B?", nl: "Waarom deze app?" },
            text: {
              en: "Models based on ‘basic fifty’ use the Corner position. But in a diamond system, where exactly is the cue ball—at which diamond? Without a defined line or projection rule, that is not unambiguous.",
              nl: "Modellen die gebruikmaken van ‘basis vijftig’ gebruiken de positie Hoek. Maar als je een stippensysteem hanteert: waar ligt de speelbal precies—bij welke stip? Zonder vastgelegde lijn of projectieregel is dat niet eenduidig."
            },
            image: {
              source: "schematic",
              line: "VIJF",
              parts: [],
              cornerBall: true,
              cueBallPosition: {
                key: "hoek",
                labels: { en: "Corner", nl: "Hoek" },
                reference: "inner_cushion_edges",
                rightDistanceBallDiameters: 1,
                southDistanceBallDiameters: 1
              }
            }
          },
          {
            key: "checked-lines",
            title: { en: "I record lines", nl: "Ik noteer lijnen" },
            text: {
              en: "I record complete lines I have played and checked repeatedly—not isolated diamonds.",
              nl: "Ik noteer volledige lijnen die ik zelf heb gespeeld en meermalen heb gecontroleerd—geen losse stippen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"] }
          },
          {
            key: "av",
            title: { en: "A and V belong to diamond lines", nl: "A en V horen bij de stiplijnen" },
            text: {
              en: "A is arrival and V is departure. Every value refers to a diamond and its diamond line. The cushion edge is visible, but is never the measuring line.",
              nl: "A is aankomst en V is vertrek. Iedere waarde verwijst naar een stip en de bijbehorende stiplijn. De bandrand blijft zichtbaar, maar is nooit de meetlijn."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "shift",
            title: { en: "Shift names the next line", nl: "Schuif benoemt de volgende lijn" },
            text: {
              en: "SHIFT moves the complete line setup. FIVE can become SIX, and the same naming extends to ZERO and later lines. The line—not one diamond—is the unit.",
              nl: "SCHUIF verplaatst de volledige lijnopzet. VIJF wordt zo ZES; dezelfde naamgeving geldt ook voor NUL en latere lijnen. De lijn—niet één stip—is de eenheid."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus"] }
          }
        ]
      }
    ]
  },
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
    junctionBalls: {
      draggable: true,
      axis: "along_cushion",
      updatesBothAdjacentValues: true,
      valuePrecision: 1,
      keyboardStep: 1,
      touchTargetRadiusBallRadii: 2.4,
      showDragHalo: true,
      lockPageScrollWhileDragging: true,
      mobileNudgePanel: {
        enabled: true,
        steps: [-10,-1,1,10],
        selectByTap: true
      },
      clickZone: {
        includes: ["ball","arrival_A","next_departure_V"],
        paddingSvg: 18,
        showOutline: true
      },
      twoFingerMobileDrag: {
        enabled: true,
        firstFinger: "hold_ball_A_V_zone",
        secondFinger: "drag_anywhere",
        showInstructions: true
      }
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
  lineOneVariants: {
    defaultMode: "basis",
    modes: ["basis", "parallel", "waaier"],
    parallel: {
      minimumOffset: -4,
      maximumOffset: 4,
      defaultOffset: 0,
      longRailUnitsPerStep: 10,
      startLabel: "Z",
      startAxis: "vertical_centerline",
      rule: "translate_line_one_without_rotation"
    },
    fan: {
      rule: "rotate_line_one_around_Z",
      startPoint: "Z",
      entries: [
        { key: "HALFZES", labels: { en: "FIVE-AND-A-HALF", nl: "HALFZES" }, between: ["VIJF", "ZES"], fraction: 0.5 }
      ]
    }
  },
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
    {key:"been",labels:{en:"Leg",nl:"Been"},color:"#d5a21d"},
    {key:"hiel",labels:{en:"Heel",nl:"Hiel"},color:"#b7791f"},
    {key:"voet",labels:{en:"Foot",nl:"Voet"},color:"#3aa6a0"},
    {key:"teen",labels:{en:"Toe",nl:"Teen"},color:"#6b7fd7"}
  ],
  departureOptions: ["neus","kop"],
  fixedPartBands: {
    neus:{from:"Z",to:"west"}, kop:{from:"west",to:"noord"},
    nek:{from:"noord",to:"oost"}, romp:{from:"oost",to:"zuid"},
    kruis:{from:"zuid",to:"west"}, been:{from:"west",to:"noord"},
    hiel:{from:"noord",to:"oost"}, voet:{from:"oost",to:"zuid"}, teen:{from:"zuid",to:"west"}
  },
  partPointZones: {
    been: {
      to: {
        type: "continuous_corner_zone",
        canonicalPath: [
          {band:"noord",minimum:20,maximum:40,direction:"toward_northeast_corner"},
          {band:"oost",minimum:0,maximum:80,direction:"along_east_long_rail"}
        ],
        mirroredPath: [
          {band:"noord",minimum:0,maximum:20,direction:"toward_northwest_corner"},
          {band:"west",minimum:0,maximum:80,direction:"along_west_long_rail"}
        ],
        defaultPoint:{band:"noord",value:20},
        switchBandAtCorner:true
      }
    }
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
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}},
      kruis:{from:{band:"zuid",value:36},to:{band:"west",value:10}},
      been:{from:{band:"west",value:5},to:{band:"oost",value:70}}
    }},
    groot:{VIJF:{
      neus:{from:{kind:"acquit",value:"Z"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:38},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:15},to:{band:"oost",value:30}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}}
    }}
  }
};
