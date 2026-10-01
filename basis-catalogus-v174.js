window.THREEB_BASES=[];
globalThis.THREEB_BASES.push((()=>{const window={};
window.THREEB_START_CONFIG = {
  version: 101, release: "171", publicRelease: "171",
  userDisplay: {
    defaultLineOpacity: 0.58,
    defaultArrowMode: "request",
    defaultArrowScale: 0.35,
    defaultValueLabelMode: "on",
    valueLabelModes: ["on", "off"],
    defaultValueLabelScale: 0.75,
    valueLabelScaleRange: { minimum: 0.65, maximum: 1, step: 0.05 },
    valueLabelBaseFontPx: 12,
    lineOpacityRange: { minimum: 0.3, maximum: 1, step: 0.05 },
    arrowScaleRange: { minimum: 0.35, maximum: 1.2, step: 0.05 }
  },
  onscreenMenu: {
    menuButtonPosition: "corner", // "corner" of "central"
    safeGapPx: 10,
    zones: ["top", "left", "right", "bottom"],
    groups: {
      track: { zone: "top", order: 10, visible: true },
      previous: { zone: "left", order: 10, visible: true },
      next: { zone: "right", order: 10, visible: true },
      menuToggle: { zone: "bottom", order: 10, visible: true },
      edit: { zone: "bottom", order: 20, visible: true },
      menuPanel: { zone: "bottom", order: 30, visible: true }
    }
  },
  tableOrientation: {
    label: "Canoniek rechtop",
    canonicalAxes: { north: "top", south: "bottom", west: "left", east: "right" },
    allowVisualRotation: false,
    eastWest: {
      desktop: false,
      mobileLandscape: true,
      mobilePortrait: false
    }
  },
  tablePanel: {
    draggable: true,
    autoAvoidTouchedLine: true,
    defaultX: 0,
    defaultY: 0,
    maximumOffsetXPercent: 38,
    maximumOffsetYPercent: 36,
    appearance: {
      background: "#167555",
      foreground: "#fff8e8",
      border: "#f4cf66",
      minimumWidthPx: 132,
      paddingHorizontalPx: 6,
      paddingVerticalPx: 5,
      controlSizePx: 31,
      hitSlopPx: 6,
      labelFontPx: 10,
      valueFontPx: 13
    }
  },
  seriesOverview: {
    toggleOnStartBall: true,
    showFanNoses: true,
    showParallelTracks: true,
    includeHalfPositions: true,
    inactiveOpacity: 0.34,
    inactiveWidthSvg: 1.6,
    activeWidthSvg: 5,
    defaultFocus: "basis",
    allowUserFocusChoice: true,
    allowCourseOverride: true,
    focusProfiles: {
      basis: {
        labels: { nl: "Neus + Romp", en: "Nose + Body" },
        parts: ["neus", "romp"], activeWideParts: ["romp"], showArrivals: false
      },
      noord: {
        labels: { nl: "Noordband · Kop + Nek", en: "North cushion · Head + Neck" },
        parts: ["kop", "nek"], activeWideParts: ["kop", "nek"], showArrivals: false
      },
      actieveLijn: {
        labels: { nl: "Actieve lijn", en: "Active line" },
        parts: ["$active"], activeWideParts: ["$active"], showArrivals: false
      },
      alleLijnen: {
        labels: { nl: "Alle lijnen", en: "All lines" },
        parts: ["$all"], activeWideParts: ["$active"], showArrivals: false
      },
      aankomsten: {
        labels: { nl: "Neus + Romp · aankomsten", en: "Nose + Body · arrivals" },
        parts: ["neus", "romp"], activeWideParts: ["romp"], showArrivals: true
      }
    },
    courseFocusProfiles: {
      les1: "basis",
      noordband: "noord",
      aankomsten: "aankomsten"
    }
  },
  userAccess: {
    defaultAddressForm: "jij",
    addressForms: ["jij", "u"],
    requireEmailForEditing: true,
    supabase: {
      paymentEnabled: false,
      paymentUrl: "",
      paymentAnonKey: "",
      url: "",
      anonKey: "",
      table: "user_tables",
      mollieFunction: "create-mollie-payment",
      sessionFunction: "record_app_session"
    },
    sessionTracking: {
      enabled: true,
      heartbeatSeconds: 30
    },
    storageModes: ["account"],
    defaultStorageMode: "account",
    barTab: {
      enabled: true,
      currency: "EUR",
      items: [
        { key: "nul", labels: { nl: "€0", en: "€0" }, amount: "0.00" },
        { key: "spa_rood", labels: { nl: "Spa rood voor straks", en: "Sparkling water for later" }, amount: "2.50" },
        { key: "bitterballen", labels: { nl: "Rondje bitterballen!", en: "A round of bitterballen!" }, amount: "8.00" }
      ]
    }
  },
  terminology: {
    pattern: { key: "LKL", en: "long-short-long", nl: "lang-kort-lang" },
    trackName: {
      default: "spoor",
      choices: {
        spoor: { singular: { en: "Track", nl: "Spoor" }, plural: { en: "Tracks", nl: "Sporen" } },
        lijn: { singular: { en: "Line", nl: "Lijn" }, plural: { en: "Lines", nl: "Lijnen" } },
        patroon: { singular: { en: "Pattern", nl: "Patroon" }, plural: { en: "Patterns", nl: "Patronen" } }
      }
    },
    line: { en: "Line", nl: "Lijn" },
    part: { en: "Part", nl: "Deel" },
    firstLine: { en: "Line 1 · departure line", nl: "Lijn 1 · afstootlijn" },
    glossary: {
      baseTrack: { en:"Base track", nl:"Basisspoor" },
      fan: { en:"Fan", nl:"Waaier" },
      fanPosition: { en:"Fan position", nl:"Waaierstand" },
      halfPosition: { en:"HALF position", nl:"HALF-stand" },
      parallelSeries: { en:"Parallel (P)", nl:"Parallel (P)" },
      parallelPosition: { en:"Parallel position", nl:"Parallelstand" },
      arrivalsView: { en:"Arrivals view", nl:"Aankomstenweergave" }
    },
    diamondLine: {
      en: "Diamond line: the measuring line along one cushion that connects its diamonds. Every cushion has its own diamond line.",
      nl: "Stiplijn: de meetlijn langs één band die de stippen van die band verbindt. Iedere band heeft een eigen stiplijn."
    }
  },
  defaultLanguage: "nl", defaultTableMode: "groot", defaultDirection: "west", defaultDeparture: "neus",
  editor: {
    defaultMode: "basis",
    modes: ["basis","alle"],
    lklBasicParts: ["neus","romp"],
    compactBallValueEditor: true,
    liveUpdate: true,
    openGesture: "single_click_or_tap"
  },
  courseCases: [
    {
      key: "case-five-minus-one-start", ownerOnly: true, scope: "lijn_tafel", level: "Kruin-cases", table: "klein", line: "VIJF",
      title: { en: "Case 1 · choose the track", nl: "Case 1 · kies het spoor" },
      text: { en: "Ball 2 is at this course position. Which track do you play?", nl: "Bal 2 ligt op deze cursuspositie. Welk spoor speel je?" },
      answer: { en: "Track FIVE−1.", nl: "Spoor VIJF−1." },
      case: { targetBall: 2, position: { kind: "parallelStart", baseTrack: "VIJF", offset: -1 } },
      image: { source: "KruinLines", line: "VIJF", parts: [], tables: ["klein"], casePositionOnly: true }
    }
  ],
  explanation: {
    version: "0.7",
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
        labels: { en: "Lesson 1 · Track FIVE", nl: "Les 1 · Spoor VIJF" },
        description: {
          en: "Track FIVE only: Line 1 Nose + Line 4 Body, using the Kruin image.",
          nl: "Alleen Spoor VIJF: Lijn 1 Neus + Lijn 4 Romp, volgens het Kruinbeeld."
        },
        slides: [
          {
            key: "route-names-three-minus-plus",
            title: { en: "The complete route", nl: "De volledige balbaan" },
            text: {
              en: "The route is named Nose, Head, Neck, Body, Cross, Leg, Heel, Foot and Toe. Leg could also have been called Tail. In this course, Leg and Heel together are called the Run-out. Nose, Head and Neck introduce the run-up below three cushions. Route choices for the target ball start at Body: three cushions or more.",
              nl: "De balbaan heet Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen. Been had ook Staart mogen heten. In de cursus heten Been en Hiel samen de Uitloop. Neus, Kop en Nek introduceren de aanloop onder drie banden. De routekeuze voor de doelbal begint bij Romp: drie banden of meer."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel","voet","teen"], tables: ["klein"] }
          },
          {
            key: "nose-reference-and-user",
            title: { en: "Kruin Nose and User Nose", nl: "Kruinneus en Gebruikersneus" },
            text: {
              en: "Kruin configures a reference Nose for every track. Make ball 1 arrive rolling at cushion 1. If ball 1 does not align with the target-ball track, cautiously change the Nose direction, play several attempts and record your local User Nose. A short Nose usually needs only a small correction, but that small correction can have large consequences. A longer Nose may require a larger correction. Do not assume: measure.",
              nl: "Kruin configureert per spoor een Kruinneus als referentie. Laat bal 1 rollend aankomen op band 1. Strookt bal 1 niet met het spoor van de doelbal, verander dan voorzichtig de richting van de Neus, speel meerdere pogingen en bewaar lokaal de Gebruikersneus. Een korte Neus vraagt meestal slechts een kleine correctie, maar die kleine correctie kan grote gevolgen hebben. Bij een langere Neus kan een grotere correctie nodig zijn. Neem niets aan: meet."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus"], tables: ["klein"] }
          },
          {
            key: "find-target-track",
            title: { en: "1 · Which track is my target ball on?", nl: "1 · Op welk spoor ligt mijn doelbal?" },
            text: {
              en: "First look only at ball 2: which 3+ route is it on? Only Body (3 cushions) and the later route parts are offered. More than one track may fit. Choose one or more candidates and compare them.",
              nl: "Kijk eerst alleen naar bal 2: op welke 3+-route ligt mijn doelbal? Alleen Romp (3 banden) en de volgende delen worden aangeboden. Er kunnen meerdere sporen passen. Kies één of meer kandidaten en vergelijk ze."
            },
            image: {
              source: "KruinLines", line: "VIJF", parts: ["neus","romp"], tables: ["klein"], focusProfile: "les1",
              targetBall: { number: 2, position: { kind: "parallelStart", baseTrack: "VIJF", offset: -1 } },
              allowMultipleTracks: true
            }
          },
          {
            key: "body-user-as-is",
            title: { en: "Track FIVE · your own stroke", nl: "Spoor VIJF · je eigen afstoot" },
            text: {
              en: "Use the Kruin image of Nose + Body. Play the Nose with your own current delivery and record the Body's arrival line in the app. Further instructions on assessing that arrival line will follow later.",
              nl: "Gebruik het Kruinbeeld van Neus + Romp. Stoot de Neus af met je huidige eigen afstoot en noteer in de app de aankomstlijn van de Romp. Verdere instructie over het beoordelen van die aankomstlijn volgt later."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], focusProfile: "les1", role: "user-as-is", recordBodyArrivalLine: true }
          },
          {
            key: "body-kruin-reference",
            title: { en: "Track FIVE · Kruin reference", nl: "Spoor VIJF · Kruinreferentie" },
            text: {
              en: "For a Kruin track, use maximum English, the mid-high contact tangent shown as the shadow line, and finishing zone M at the centre of the table. This defines Kruin Track FIVE, SIX, SEVEN or EIGHT.",
              nl: "Voor een Kruinspoor gelden: maximaal effect, de raaklijn middenhoog als schaduwlijn en eindzone M in het midden van de tafel. Dit bepaalt Kruinspoor VIJF, ZES, ZEVEN of ACHT."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], focusProfile: "les1", role: "kruin-reference", effect: "maximum", contactTangent: "mid-high", showShadowLine: true, endZone: "M", endZonePosition: "table-centre" }
          },
          {
            key: "standard-shot-middle-and-extension",
            title: { en: "First the middle, then the Run-out", nl: "Eerst het midden, daarna de Uitloop" },
            text: {
              en: "The standard stroke is based on letting ball 1 roll out toward the middle of the table. That middle zone is the first reference. In a later phase, the route was extended through Leg to Heel A using manual table tests and Kruin configuration. In this course, Leg and Heel together are called the Run-out. Treat the Run-out as a tested extension, not as the original middle reference.",
              nl: "De standaardstoot is gebaseerd op het uitrollen van bal 1 naar de middenzone van het biljart. Die middenzone is het eerste ijkpunt. In een latere fase is de baan met handmatige tests en Kruinconfig via Been doorgetrokken naar A-Hiel. Been en Hiel heten in deze cursus samen de Uitloop. Beschouw de Uitloop als een geteste uitbreiding, niet als het oorspronkelijke midden-ijkpunt."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp","kruis","been","hiel"], focusProfile: "les1", role: "middle-reference-and-tested-extension", endZone: "M", testedExtension: ["been","hiel.to"] }
          },
          {
            key: "lesson-waaier",
            title: { en: "Lesson · Fan", nl: "Les · Waaier" },
            text: {
              en: "Choose Fan for the whole and HALF tracks. A HALF track lies exactly midway between its two neighbouring tracks for every known value.",
              nl: "Kies Waaier om door de waaierstanden te gaan: basisspoor, HALF-stand en volgend spoor. De HALF-stand ligt voor iedere bekende waarde exact midden tussen de twee buursporen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp","kruis"] }
          },
          {
            key: "lesson-minus-start-plus",
            title: { en: "Lesson · Parallel (P)", nl: "Les · Parallel (P)" },
            text: {
              en: "Choose Parallel (P) for parallel tracks. In/Out reverses the side: S+ starts inside and Body A arrives outside, so its South value decreases. S− works inversely. Body, Neck and Head are then calculated backwards parallel to the base track.",
              nl: "Kies Parallel (P) voor parallelstanden rond het basisspoor. BiBu keert de zijde om: S+ begint binnen en A-Romp komt buiten aan, waardoor de Zuidwaarde daalt. S− werkt omgekeerd. Romp, Nek en Kop worden daarna parallel aan het basisspoor teruggerekend."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"] }
          },
          {
            key: "lesson-minus-start-plus-display",
            title: { en: "Lesson · View Parallel (P)", nl: "Les · Parallel (P) bekijken" },
            text: {
              en: "Choose Static · whole track to see the complete chosen ± track. Line by line retains the current track but starts again at Nose. The complete thin base track always remains fixed. In table view, − stays on the left and + on the right. Tap the centre to switch between Track and Line. The central menu also has Back to base track, for example FIVE+2 → FIVE.",
              nl: "Kies Statisch · heel spoor om het volledige gekozen ±spoor te zien. Lijn voor lijn behoudt het huidige spoor, maar begint opnieuw bij Neus. Het volledige dunne basisspoor blijft altijd vast staan. In tafelbeeld blijft − links en + rechts. Tik in het midden om tussen Spoor en Lijn te wisselen. In het centrale menu staat ook Terug naar basisspoor, bijvoorbeeld VIJF+2 → VIJF."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"], role: "parallel-display-modes" }
          },
          {
            key: "lesson-line-by-line-reset",
            title: { en: "Lesson · Restart and base track", nl: "Les · Herstart en basisspoor" },
            text: {
              en: "When you choose Line by line, the current track remains selected and the comparison restarts at Nose. Use Back to base track in the central menu only when you also want to remove the −/+ offset, for example FIVE+2 → FIVE. That action also restarts at Nose.",
              nl: "Wanneer je Lijn voor lijn kiest, blijft het huidige spoor geselecteerd en begint de vergelijking opnieuw bij Neus. Gebruik Terug naar basisspoor in het centrale menu alleen wanneer ook de −/+ verschuiving weg moet, bijvoorbeeld VIJF+2 → VIJF. Ook die actie begint opnieuw bij Neus."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp"], role: "line-reset-base-track" }
          },
          {
            key: "diamond-lines",
            title: { en: "Every cushion has its own diamond line", nl: "Iedere band heeft een eigen stiplijn" },
            text: {
              en: "A diamond line is the measuring line along one cushion that connects its diamonds. The four cushions therefore have four separate diamond lines. V and A always refer to one of these lines, never to the cushion edge.",
              nl: "Een stiplijn is de meetlijn langs één band die de stippen van die band verbindt. De vier banden hebben dus vier afzonderlijke stiplijnen. V en A verwijzen altijd naar zo'n stiplijn, nooit naar de bandrand."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "running-or-reverse",
            title: { en: "+ running · − reverse", nl: "+ mee · − contra" },
            text: {
              en: "A line starts as + (running). If the ball and therefore the line skip a cushion, the framework changes and the state switches to − (reverse). That state continues until another cushion is skipped. In Track FOUR, Body East–West causes the switch; Cross West–South remains reverse. In Track FIVE, the first switch occurs at Leg West–East.",
              nl: "Een lijn begint op + (mee). Slaan de bal en dus de lijn een band over, dan verandert het Karkas en schakelt de loop naar − (contra). Die stand blijft gelden tot een volgende bandoverslag. Bij VIER veroorzaakt Romp Oost–West de omschakeling; Kruis West–Zuid blijft contra. Bij VIJF gebeurt de eerste omschakeling bij Been West–Oost."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["kruis","been"] }
          },
          {
            key: "rule-direction",
            title: { en: "Rule · Dir", nl: "Regel · Dir" },
            text: {
              en: "Dir records the cushion order. Every A names the next cushion, but the order can differ by track. Track FIVE uses S–W–N–E–S–W–E–N. Track FOUR uses S–W–N–E–W–S–E–N.",
              nl: "Dir noteert de bandvolgorde. Iedere A noemt de volgende band, maar de volgorde kan per spoor verschillen. Spoor VIJF gebruikt S–W–N–O–Z–W–O–N. Spoor VIER gebruikt S–W–N–O–W–Z–O–N."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"] }
          },
          {
            key: "track-four-body-cross",
            title: { en: "Track FOUR · East to West", nl: "Spoor VIER · Oost naar West" },
            text: {
              en: "In Track FOUR, Body runs directly from East to West. At the same ball on the West cushion, Cross takes over and runs with reverse English toward the South cushion. After Cross, the Run-out follows: Leg + Heel. The configured Cross angle determines the exact South arrival.",
              nl: "In Spoor VIER loopt Romp rechtstreeks van Oost naar West. Op dezelfde bal aan de Westband neemt Kruis over en loopt met contra-effect naar de Zuidband. Na Kruis volgt de Uitloop: Been + Hiel. De geconfigureerde Kruishoek bepaalt de precieze aankomst op Zuid."
            },
            image: { source: "KruinLines", line: "VIER", parts: ["romp","kruis","been","hiel"], tables: ["klein","groot"], focusProfile: "actieveLijn", emphasize: "romp-kruis", loop: "-" }
          },
          {
            key: "rule-reflection",
            title: { en: "Rule · incidence equals reflection", nl: "Regel · hoek van inval is hoek van uitval" },
            text: {
              en: "For every LSL track, Heel is provisionally derived by reflecting Leg at the East cushion: the angle of incidence equals the angle of reflection. Heel remains reverse until a later cushion skip changes the state.",
              nl: "Voor ieder LKL-spoor wordt Hiel voorlopig afgeleid door Been op de Oostband te spiegelen: hoek van inval is hoek van uitval. Hiel blijft contra totdat een latere bandoverslag de stand verandert."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["been","hiel"] }
          },
          {
            key: "rule-bibu",
            title: { en: "Rule · In/Out", nl: "Regel · BiBu" },
            text: {
              en: "In/Out describes the relation between departure and Body arrival. S+1 starts inside and arrives outside on the South cushion; S−1 starts outside and arrives inside.",
              nl: "BiBu beschrijft de relatie tussen start en Romp A. S+1 begint binnen (Bi) en komt op de Zuidband buiten (Bu) aan; S−1 begint buiten en komt binnen aan."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"] }
          },
          {
            key: "rule-small-arrival-row",
            title: { en: "All balls together!", nl: "Alle ballen verzamelen!" },
            text: {
              en: "Choose Parallel (P) and Arrivals. Only the base Body line is shown, with every S−2 through S+2 arrival ball physically against cushion 4 (South). On the Small table they form a row of five exactly adjacent balls. For other lines or tables, the balls may touch, overlap or lie apart.",
              nl: "Kies Parallel (P) en Aankomsten. Je ziet alleen de basisromp met op Romp A alle aankomstballen van S−2 tot en met S+2 werkelijk tegen band 4 (Zuid). Op Klein vormen zij een rij van vijf ballen die precies naast elkaar liggen. Bij andere lijnen of tafels kunnen de ballen naast elkaar liggen, overlappen of uit elkaar liggen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["romp"], tables: ["klein"], showArrivalSeries: true, offsets: [-2,-1,0,1,2] }
          },
          {
            key: "head-neck-experience-anchors",
            title: { en: "Experience anchors · Head and Neck", nl: "Ervaringsankers · Kop en Nek" },
            text: {
              en: "Small Head A: FOUR N28, FIVE N19, SIX N10. Large Head A / Neck A: FOUR N25 / E10, FIVE N15 / E20, SIX N10 / E30. Head A is also the starting anchor for the shortened four-cushion route.",
              nl: "Klein Kop A: VIER N28, VIJF N19, ZES N10. Groot Kop A / Nek A: VIER N25 / O10, VIJF N15 / O20, ZES N10 / O30. Kop A is ook het uitgangsanker voor de verkorte vierbander."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["kop","nek"], tables: ["groot","klein"] }
          },
          {
            key: "rule-position-to-line",
            title: { en: "Rule · Position to line", nl: "Regel · Positie naar lijn" },
            text: {
              en: "Starting from a known position on the current line, determine which next line must be played. First application: Body A determines Cross, departing at 45 degrees. More position-to-line relations will be added later.",
              nl: "Ga uit van een bekende positie op de huidige lijn en bepaal welke volgende lijn gespeeld moet worden. Eerste toepassing: Romp A bepaalt Kruis, dat onder 45 graden vertrekt. Meer positie-naar-lijnrelaties volgen later."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["romp","kruis"] }
          },
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
              nl: "A is aankomst en V is vertrek. Iedere waarde verwijst naar een stip en de bijbehorende stiplijn. Een stiplijn loopt langs één band en verbindt de stippen van die band; iedere band heeft een eigen stiplijn. De bandrand blijft zichtbaar, maar is nooit de meetlijn."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "shift",
            title: { en: "Shift names the next line", nl: "Schuif benoemt de volgende lijn" },
            text: {
              en: "SHIFT moves the complete line setup. FIVE can become SIX, and the same naming extends to ZERO and later lines. The line—not one diamond—is the unit.",
              nl: "SCHUIF verplaatst de volledige spooropzet. Spoor VIJF wordt zo Spoor ZES; dezelfde naamgeving geldt ook voor Spoor NUL en latere sporen. Het spoor—niet één stip of lijnstuk—is de eenheid."
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
      defaultLengthsCm: { klein: { VIJF:83 } },
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
        includes: ["ball"],
        paddingSvg: 0,
        showOutline: true
      },
      valueWindow: {
        outsideWoodGapSvg: 3,
        widthSvg: 100,
        heightSvg: 54,
        cornerRadiusSvg: 9,
        fontSizeSvg: 13
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
      showPointType: true,
      suppressNearestTenInReplacementMode: true
    }
  },
  shotLines: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT","NEGEN","TIEN","ELF","TWAALF"],
  trackRoutes: {
    NUL: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    EEN: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    TWEE: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    DRIE: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    VIER: { startLabel: "S", arrivals: ["west","noord","oost","west","zuid","oost","noord"], rule: "each_arrival_selects_the_next_cushion", note: "body_east_to_west_then_cross_reverse_west_to_south" },
    VIJF: {
      startLabel: "S",
      arrivals: ["west","noord","oost","zuid","west","oost","noord"],
      rule: "each_arrival_selects_the_next_cushion"
    },
    ZES: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    ZEVEN: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    ACHT: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" }
  },
  lklTrackRules: {
    appliesTo: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT"],
    panelTracks: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT"],
    noseArrivalByTrack: { NUL:0, EEN:10, TWEE:20, DRIE:30, VIER:40, VIJF:50, ZES:60, ZEVEN:70, ACHT:80 },
    route: ["S","W","N","O","Z","W","O","N"],
    routeByTrack: { VIER:["S","W","N","O","W","Z","O","N"] },
    cross: { defaultAngleDegrees:45, defaultArrivalBand:"west", defaultLoop:"+", configurablePerTableAndTrack:true, rule:"depart_from_body_arrival_and_follow_configured_angle_to_configured_arrival_band" },
    leg: { to:{band:"oost",value:10,fixed:true}, from:{rule:"derive_from_cross_arrival"} },
    heel: { from:{band:"oost",rule:"shared_with_leg_arrival"}, to:{band:"noord",rule:"angle_of_incidence_equals_angle_of_reflection"} },
    experienceAnchors: {
      klein: {
        VIER: { headArrival:{band:"noord",value:28} },
        VIJF: { headArrival:{band:"noord",value:19} },
        ZES: { headArrival:{band:"noord",value:10} }
      },
      groot: {
        VIER: { headArrival:{band:"noord",value:25}, neckArrival:{band:"oost",value:10} },
        VIJF: { headArrival:{band:"noord",value:15}, neckArrival:{band:"oost",value:20} },
        ZES: { headArrival:{band:"noord",value:10}, neckArrival:{band:"oost",value:30} }
      },
      shortenedFourCushion: "use_head_arrival_as_starting_anchor"
    },
    loop: { initial:"+", toggleOnSkippedCushion:true, persistUntilNextSkippedCushion:true }
  },
  trackSpecs: {
    VIJF: {
      complete: true,
      tables: ["klein","groot"],
      loop: {
        default: "+",
        defaultMeaning: "mee",
        skippedCushion: "-",
        skippedCushionMeaning: "contra",
        rule: "use_contra_when_from_and_to_skip_an_intermediate_cushion"
      },
      parts: {
        neus: {
          fixed: true,
          from: { kind: "acquit", value: "S" },
          to: { band: "west", value: 50 }
        },
        romp: {
          source: "Kruin",
          defaultByTable: {
            klein: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 38 } },
            groot: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 36 } }
          }
        },
        kruis: {
          defaultAngleDegrees: 45,
          configurablePerTableAndTrack: true,
          rule: "derive_from_body_arrival"
        },
        been: {
          to: { band: "oost", value: 10, fixed: true },
          from: { band: "west", rule: "derive_from_cross_arrival" },
          loop: "-"
        },
        hiel: {
          from: { band: "oost", rule: "shared_with_leg_arrival" },
          to: { band: "noord", rule: "angle_of_incidence_equals_angle_of_reflection" },
          loop: "-"
        }
      }
    }
  },
  rules: {
    Dir: {
      labels: { en: "Direction", nl: "Richting" },
      rule: "each_arrival_names_the_next_cushion",
      five: ["S","W","N","O","Z","W","O","N"]
    },
    Loop: {
      labels: { en: "Running / reverse", nl: "Mee / contra" },
      initial: "+",
      toggleOnSkippedCushion: true,
      persistUntilNextSkippedCushion: true,
      skippedCushionPairs: [["west","oost"],["oost","west"],["noord","zuid"],["zuid","noord"]],
      skeletonConsequence: "a_skipped_cushion_changes_the_framework_and_switches_running_reverse_state",
      note: "Track FOUR Body east_to_west switches to reverse; Cross west_to_south inherits reverse"
    },
    Reflection: {
      labels: { en: "Angle of incidence equals angle of reflection", nl: "Hoek van inval is hoek van uitval" },
      appliesTo: ["hiel"],
      status: "provisional"
    },
    PositionToLine: {
      labels: { en: "Position to line", nl: "Positie naar lijn" },
      rule: "a_known_position_on_the_current_line_determines_the_next_line_to_play",
      applications: [
        { from:{part:"romp",point:"A"}, to:{part:"kruis",departureAngleSource:"Kruinconfig.crossAngleDeg",defaultDegrees:45} }
      ],
      status: "extend_in_explanation_later"
    },
    BiBu: {
      labels: { en: "In/Out", nl: "BiBu" },
      relation: "opposite_sides",
      plus: { departure:"inside", bodyArrival:"outside", southDiamondDirection:"minus" },
      minus: { departure:"outside", bodyArrival:"inside", southDiamondDirection:"plus" }
    },
    SmallLklArrivalRow: {
      table: "klein",
      departureOffsets: [-2,-1,0,1,2],
      arrivalBand: "zuid",
      appearance: "adjacent_ball_row"
    }
  },
  lineOneVariants: {
    defaultMode: "basis",
    modes: ["basis", "parallel", "waaier"],
    parallel: {
      minimumOffset: -2,
      maximumOffset: 8,
      defaultOffset: 0,
      longRailUnitsPerStep: 10,
      startLabel: "S",
      startAxis: "vertical_centerline",
      arrivalConstraint: { band:"west", minimum:0, maximum:80 },
      bodyArrivalByTable: {
        klein: { band:"zuid", ballWidthsPerStep:1, ballDiameterCm:6.15, diamondUnitsPerStep:6.15/115*40, offsetSign:-1 },
        groot: { band:"zuid", ballWidthsPerStep:1.5, ballDiameterCm:6.15, diamondUnitsPerStep:1.5*6.15/142*40, offsetSign:-1 }
      },
      backwardFromBodyArrival: {
        parts: ["romp","nek","kop"],
        rule: "keep_each_part_parallel_to_its_base_track"
      },
      rule: "BiBu: plus_start_inside_body_A_outside_so_south_value_decreases; minus_is_inverse; then_body_neck_head_recalculate_backward"
    },
    fan: {
      rule: "every_known_value_is_midpoint_of_adjacent_tracks",
      entries: [
        { key:"HALFEEN", between:["NUL","EEN"], noseArrival:5, fraction:0.5 },
        { key:"HALFTWEE", between:["EEN","TWEE"], noseArrival:15, fraction:0.5 },
        { key:"HALFDRIE", between:["TWEE","DRIE"], noseArrival:25, fraction:0.5 },
        { key:"HALFVIER", between:["DRIE","VIER"], noseArrival:35, fraction:0.5 },
        { key:"HALFVIJF", between:["VIER","VIJF"], noseArrival:45, fraction:0.5 },
        { key:"HALFZES", between:["VIJF","ZES"], noseArrival:55, fraction:0.5 },
        { key:"HALFZEVEN", between:["ZES","ZEVEN"], noseArrival:65, fraction:0.5 },
        { key:"HALFACHT", between:["ZEVEN","ACHT"], noseArrival:75, fraction:0.5 }
      ]
    }
  },
  patternByLine: { NUL:"LKL", EEN:"LKL", TWEE:"LKL", DRIE:"LKL", VIER:"LKL", VIJF:"LKL", ZES:"LKL", ZEVEN:"LKL", ACHT:"LKL" },
  patternLabels: {
    NUL:{en:"ZERO",nl:"NUL"}, EEN:{en:"ONE",nl:"EEN"}, TWEE:{en:"TWO",nl:"TWEE"}, DRIE:{en:"THREE",nl:"DRIE"}, VIER:{en:"FOUR",nl:"VIER"},
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
    neus:{from:"V",to:"west"}, kop:{from:"west",to:"noord"},
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
    restrictionsEnabled:false,
    wrap:true,
    integerStep:1,
    overrides:{}
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
    klein:{
    VIER:{romp:{from:{band:"oost",value:5},to:{band:"zuid",value:70}}},
    VIJF:{
      neus:{from:{kind:"acquit",value:"S"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:35,status:"calculated"},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:13,status:"calculated"},to:{band:"oost",value:32,status:"calculated"}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}},
      kruis:{from:{band:"zuid",value:31,status:"calculated"},to:{band:"west",value:10}},
      been:{from:{band:"west",value:null,status:"calculated"},to:{band:"oost",value:10,status:"approved"}}
    },
    ZES:{romp:{from:{band:"oost",value:30},to:{band:"zuid",value:30}}},
    ZEVEN:{romp:{from:{band:"oost",value:35},to:{band:"zuid",value:20}}},
    ACHT:{romp:{from:{band:"oost",value:43},to:{band:"zuid",value:19}}}
    },
    groot:{
    VIJF:{
      neus:{from:{kind:"acquit",value:"S"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:null,status:"calculated"},to:{band:"noord",value:15,status:"approved"}},
      nek:{from:{band:"noord",value:null,status:"calculated"},to:{band:"oost",value:20,status:"approved"}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:36}},
      been:{from:{band:"west",value:null,status:"calculated"},to:{band:"oost",value:10,status:"approved"}}
    },
    ZES:{romp:{from:{band:"oost",value:30},to:{band:"zuid",value:28}}},
    ZEVEN:{romp:{from:{band:"oost",value:37},to:{band:"zuid",value:22}}},
    ACHT:{romp:{from:{band:"oost",value:48},to:{band:"zuid",value:18}}}
    }
  }
};

return {id:"kruin-v172-d98fabf0dc31b28a5449",label:"Kruin v172 · oorspronkelijke basis",config:window.THREEB_START_CONFIG,values:{"onscreenMenu":{"groups":{"edit":{"order":20,"visible":true,"zone":"bottom"},"menuPanel":{"order":30,"visible":true,"zone":"bottom"},"menuToggle":{"order":10,"visible":true,"zone":"bottom"},"next":{"order":10,"visible":true,"zone":"right"},"previous":{"order":10,"visible":true,"zone":"left"},"track":{"order":10,"visible":true,"zone":"top"}},"safeGapPx":10,"zones":["top","left","right","bottom"]},"release":172,"savedSpoorValues":[],"source":"Kruinconfig-3B-v172.ods","tracks":{"groot":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":18},"rompV":{"band":"oost","value":48}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":20.599},"rompV":{"band":"oost","value":44}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.197},"rompV":{"band":"oost","value":39}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":20},"rompV":{"band":"oost","value":42.5}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":15},"neusA":{"band":"west","value":45}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12.5},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":32},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":33.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":40}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":15},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":36},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":6},"nekA":{"band":"oost","value":32},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":33.401},"rompV":{"band":"oost","value":24}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":36},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":30.803},"rompV":{"band":"oost","value":28}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":41},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":28.204},"rompV":{"band":"oost","value":33}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":24},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":38.599},"rompV":{"band":"oost","value":16}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":41.197},"rompV":{"band":"oost","value":12}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":28},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":43},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":25.401},"rompV":{"band":"oost","value":34}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":48},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":22.803},"rompV":{"band":"oost","value":39}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":30.599},"rompV":{"band":"oost","value":26}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":33.197},"rompV":{"band":"oost","value":21}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":22},"rompV":{"band":"oost","value":37}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19.401},"rompV":{"band":"oost","value":42}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":24.599},"rompV":{"band":"oost","value":32}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":27.197},"rompV":{"band":"oost","value":27}}},"klein":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":2},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19},"rompV":{"band":"oost","value":43}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":21.14},"rompV":{"band":"oost","value":39}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.278},"rompV":{"band":"oost","value":35}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":19.5},"rompV":{"band":"oost","value":39}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":23.5},"neusA":{"band":"west","value":45},"rompA":{"band":"zuid","value":54},"rompV":{"band":"oost","value":12.5}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":14.5},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":34},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":32.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":28},"neusA":{"band":"west","value":40},"rompA":{"band":"west","value":10},"rompV":{"band":"oost","value":10}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":14},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":67.861},"rompV":{"band":"oost","value":7}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":17},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":65.722},"rompV":{"band":"oost","value":10}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":19},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":63.583},"rompV":{"band":"oost","value":12}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":32},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":72.14},"rompV":{"band":"oost","value":3}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":36},"nekA":{"band":"oost","value":7},"neusA":{"band":"west","value":20},"rompA":{"band":"zuid","value":74.278},"rompV":{"band":"oost","value":0}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":19},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":38},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":35.861},"rompV":{"band":"oost","value":23}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":13},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":33.722},"rompV":{"band":"oost","value":27}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":42},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":31.583},"rompV":{"band":"oost","value":30}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":22},"nekA":{"band":"oost","value":29},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":40.14},"rompV":{"band":"oost","value":17}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":42.278},"rompV":{"band":"oost","value":13}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":30},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":7},"nekA":{"band":"oost","value":45},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":27.861},"rompV":{"band":"oost","value":33}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":49},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":25.722},"rompV":{"band":"oost","value":37}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":32.14},"rompV":{"band":"oost","value":27}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":34.278},"rompV":{"band":"oost","value":23}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":23},"rompV":{"band":"oost","value":35}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":17.861},"rompV":{"band":"oost","value":39}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":22.14},"rompV":{"band":"oost","value":31}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":24.278},"rompV":{"band":"oost","value":26}}}}}};})());
globalThis.THREEB_BASES.push((()=>{const window={};
window.THREEB_START_CONFIG = {
  version: 101, release: "173", publicRelease: "173",
  userDisplay: {
    defaultLineOpacity: 0.58,
    defaultArrowMode: "request",
    defaultArrowScale: 0.35,
    defaultValueLabelMode: "on",
    valueLabelModes: ["on", "off"],
    defaultValueLabelScale: 0.75,
    valueLabelScaleRange: { minimum: 0.65, maximum: 1, step: 0.05 },
    valueLabelBaseFontPx: 12,
    lineOpacityRange: { minimum: 0.3, maximum: 1, step: 0.05 },
    arrowScaleRange: { minimum: 0.35, maximum: 1.2, step: 0.05 }
  },
  onscreenMenu: {
    menuButtonPosition: "corner", // "corner" of "central"
    safeGapPx: 10,
    zones: ["top", "left", "right", "bottom"],
    groups: {
      track: { zone: "top", order: 10, visible: true },
      previous: { zone: "left", order: 10, visible: true },
      next: { zone: "right", order: 10, visible: true },
      menuToggle: { zone: "bottom", order: 10, visible: true },
      edit: { zone: "bottom", order: 20, visible: true },
      menuPanel: { zone: "bottom", order: 30, visible: true }
    }
  },
  tableOrientation: {
    label: "Canoniek rechtop",
    canonicalAxes: { north: "top", south: "bottom", west: "left", east: "right" },
    allowVisualRotation: false,
    eastWest: {
      desktop: false,
      mobileLandscape: true,
      mobilePortrait: false
    }
  },
  tablePanel: {
    draggable: true,
    autoAvoidTouchedLine: true,
    defaultX: 0,
    defaultY: 0,
    maximumOffsetXPercent: 38,
    maximumOffsetYPercent: 36,
    appearance: {
      background: "#167555",
      foreground: "#fff8e8",
      border: "#f4cf66",
      minimumWidthPx: 132,
      paddingHorizontalPx: 6,
      paddingVerticalPx: 5,
      controlSizePx: 31,
      hitSlopPx: 6,
      labelFontPx: 10,
      valueFontPx: 13
    }
  },
  seriesOverview: {
    toggleOnStartBall: true,
    showFanNoses: true,
    showParallelTracks: true,
    includeHalfPositions: true,
    inactiveOpacity: 0.34,
    inactiveWidthSvg: 1.6,
    activeWidthSvg: 5,
    defaultFocus: "basis",
    allowUserFocusChoice: true,
    allowCourseOverride: true,
    focusProfiles: {
      basis: {
        labels: { nl: "Neus + Romp", en: "Nose + Body" },
        parts: ["neus", "romp"], activeWideParts: ["romp"], showArrivals: false
      },
      noord: {
        labels: { nl: "Noordband · Kop + Nek", en: "North cushion · Head + Neck" },
        parts: ["kop", "nek"], activeWideParts: ["kop", "nek"], showArrivals: false
      },
      actieveLijn: {
        labels: { nl: "Actieve lijn", en: "Active line" },
        parts: ["$active"], activeWideParts: ["$active"], showArrivals: false
      },
      alleLijnen: {
        labels: { nl: "Alle lijnen", en: "All lines" },
        parts: ["$all"], activeWideParts: ["$active"], showArrivals: false
      },
      aankomsten: {
        labels: { nl: "Neus + Romp · aankomsten", en: "Nose + Body · arrivals" },
        parts: ["neus", "romp"], activeWideParts: ["romp"], showArrivals: true
      }
    },
    courseFocusProfiles: {
      les1: "basis",
      noordband: "noord",
      aankomsten: "aankomsten"
    }
  },
  userAccess: {
    defaultAddressForm: "jij",
    addressForms: ["jij", "u"],
    requireEmailForEditing: true,
    supabase: {
      paymentEnabled: false,
      paymentUrl: "",
      paymentAnonKey: "",
      url: "",
      anonKey: "",
      table: "user_tables",
      mollieFunction: "create-mollie-payment",
      sessionFunction: "record_app_session"
    },
    sessionTracking: {
      enabled: true,
      heartbeatSeconds: 30
    },
    storageModes: ["account"],
    defaultStorageMode: "account",
    barTab: {
      enabled: true,
      currency: "EUR",
      items: [
        { key: "nul", labels: { nl: "€0", en: "€0" }, amount: "0.00" },
        { key: "spa_rood", labels: { nl: "Spa rood voor straks", en: "Sparkling water for later" }, amount: "2.50" },
        { key: "bitterballen", labels: { nl: "Rondje bitterballen!", en: "A round of bitterballen!" }, amount: "8.00" }
      ]
    }
  },
  terminology: {
    pattern: { key: "LKL", en: "long-short-long", nl: "lang-kort-lang" },
    trackName: {
      default: "spoor",
      choices: {
        spoor: { singular: { en: "Track", nl: "Spoor" }, plural: { en: "Tracks", nl: "Sporen" } },
        lijn: { singular: { en: "Line", nl: "Lijn" }, plural: { en: "Lines", nl: "Lijnen" } },
        patroon: { singular: { en: "Pattern", nl: "Patroon" }, plural: { en: "Patterns", nl: "Patronen" } }
      }
    },
    line: { en: "Line", nl: "Lijn" },
    part: { en: "Part", nl: "Deel" },
    firstLine: { en: "Line 1 · departure line", nl: "Lijn 1 · afstootlijn" },
    glossary: {
      baseTrack: { en:"Base track", nl:"Basisspoor" },
      fan: { en:"Fan", nl:"Waaier" },
      fanPosition: { en:"Fan position", nl:"Waaierstand" },
      halfPosition: { en:"HALF position", nl:"HALF-stand" },
      parallelSeries: { en:"Parallel (P)", nl:"Parallel (P)" },
      parallelPosition: { en:"Parallel position", nl:"Parallelstand" },
      arrivalsView: { en:"Arrivals view", nl:"Aankomstenweergave" }
    },
    diamondLine: {
      en: "Diamond line: the measuring line along one cushion that connects its diamonds. Every cushion has its own diamond line.",
      nl: "Stiplijn: de meetlijn langs één band die de stippen van die band verbindt. Iedere band heeft een eigen stiplijn."
    }
  },
  defaultLanguage: "nl", defaultTableMode: "groot", defaultDirection: "west", defaultDeparture: "neus",
  editor: {
    defaultMode: "basis",
    modes: ["basis","alle"],
    lklBasicParts: ["neus","romp"],
    compactBallValueEditor: true,
    liveUpdate: true,
    openGesture: "single_click_or_tap"
  },
  courseCases: [
    {
      key: "case-five-minus-one-start", ownerOnly: true, scope: "lijn_tafel", level: "Kruin-cases", table: "klein", line: "VIJF",
      title: { en: "Case 1 · choose the track", nl: "Case 1 · kies het spoor" },
      text: { en: "Ball 2 is at this course position. Which track do you play?", nl: "Bal 2 ligt op deze cursuspositie. Welk spoor speel je?" },
      answer: { en: "Track FIVE−1.", nl: "Spoor VIJF−1." },
      case: { targetBall: 2, position: { kind: "parallelStart", baseTrack: "VIJF", offset: -1 } },
      image: { source: "KruinLines", line: "VIJF", parts: [], tables: ["klein"], casePositionOnly: true }
    }
  ],
  explanation: {
    version: "0.7",
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
        labels: { en: "Lesson 1 · Track FIVE", nl: "Les 1 · Spoor VIJF" },
        description: {
          en: "Track FIVE only: Line 1 Nose + Line 4 Body, using the Kruin image.",
          nl: "Alleen Spoor VIJF: Lijn 1 Neus + Lijn 4 Romp, volgens het Kruinbeeld."
        },
        slides: [
          {
            key: "route-names-three-minus-plus",
            title: { en: "The complete route", nl: "De volledige balbaan" },
            text: {
              en: "The route is named Nose, Head, Neck, Body, Cross, Leg, Heel, Foot and Toe. Leg could also have been called Tail. In this course, Leg and Heel together are called the Run-out. Nose, Head and Neck introduce the run-up below three cushions. Route choices for the target ball start at Body: three cushions or more.",
              nl: "De balbaan heet Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen. Been had ook Staart mogen heten. In de cursus heten Been en Hiel samen de Uitloop. Neus, Kop en Nek introduceren de aanloop onder drie banden. De routekeuze voor de doelbal begint bij Romp: drie banden of meer."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel","voet","teen"], tables: ["klein"] }
          },
          {
            key: "nose-reference-and-user",
            title: { en: "Kruin Nose and User Nose", nl: "Kruinneus en Gebruikersneus" },
            text: {
              en: "Kruin configures a reference Nose for every track. Make ball 1 arrive rolling at cushion 1. If ball 1 does not align with the target-ball track, cautiously change the Nose direction, play several attempts and record your local User Nose. A short Nose usually needs only a small correction, but that small correction can have large consequences. A longer Nose may require a larger correction. Do not assume: measure.",
              nl: "Kruin configureert per spoor een Kruinneus als referentie. Laat bal 1 rollend aankomen op band 1. Strookt bal 1 niet met het spoor van de doelbal, verander dan voorzichtig de richting van de Neus, speel meerdere pogingen en bewaar lokaal de Gebruikersneus. Een korte Neus vraagt meestal slechts een kleine correctie, maar die kleine correctie kan grote gevolgen hebben. Bij een langere Neus kan een grotere correctie nodig zijn. Neem niets aan: meet."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus"], tables: ["klein"] }
          },
          {
            key: "find-target-track",
            title: { en: "1 · Which track is my target ball on?", nl: "1 · Op welk spoor ligt mijn doelbal?" },
            text: {
              en: "First look only at ball 2: which 3+ route is it on? Only Body (3 cushions) and the later route parts are offered. More than one track may fit. Choose one or more candidates and compare them.",
              nl: "Kijk eerst alleen naar bal 2: op welke 3+-route ligt mijn doelbal? Alleen Romp (3 banden) en de volgende delen worden aangeboden. Er kunnen meerdere sporen passen. Kies één of meer kandidaten en vergelijk ze."
            },
            image: {
              source: "KruinLines", line: "VIJF", parts: ["neus","romp"], tables: ["klein"], focusProfile: "les1",
              targetBall: { number: 2, position: { kind: "parallelStart", baseTrack: "VIJF", offset: -1 } },
              allowMultipleTracks: true
            }
          },
          {
            key: "body-user-as-is",
            title: { en: "Track FIVE · your own stroke", nl: "Spoor VIJF · je eigen afstoot" },
            text: {
              en: "Use the Kruin image of Nose + Body. Play the Nose with your own current delivery and record the Body's arrival line in the app. Further instructions on assessing that arrival line will follow later.",
              nl: "Gebruik het Kruinbeeld van Neus + Romp. Stoot de Neus af met je huidige eigen afstoot en noteer in de app de aankomstlijn van de Romp. Verdere instructie over het beoordelen van die aankomstlijn volgt later."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], focusProfile: "les1", role: "user-as-is", recordBodyArrivalLine: true }
          },
          {
            key: "body-kruin-reference",
            title: { en: "Track FIVE · Kruin reference", nl: "Spoor VIJF · Kruinreferentie" },
            text: {
              en: "For a Kruin track, use maximum English, the mid-high contact tangent shown as the shadow line, and finishing zone M at the centre of the table. This defines Kruin Track FIVE, SIX, SEVEN or EIGHT.",
              nl: "Voor een Kruinspoor gelden: maximaal effect, de raaklijn middenhoog als schaduwlijn en eindzone M in het midden van de tafel. Dit bepaalt Kruinspoor VIJF, ZES, ZEVEN of ACHT."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], focusProfile: "les1", role: "kruin-reference", effect: "maximum", contactTangent: "mid-high", showShadowLine: true, endZone: "M", endZonePosition: "table-centre" }
          },
          {
            key: "standard-shot-middle-and-extension",
            title: { en: "First the middle, then the Run-out", nl: "Eerst het midden, daarna de Uitloop" },
            text: {
              en: "The standard stroke is based on letting ball 1 roll out toward the middle of the table. That middle zone is the first reference. In a later phase, the route was extended through Leg to Heel A using manual table tests and Kruin configuration. In this course, Leg and Heel together are called the Run-out. Treat the Run-out as a tested extension, not as the original middle reference.",
              nl: "De standaardstoot is gebaseerd op het uitrollen van bal 1 naar de middenzone van het biljart. Die middenzone is het eerste ijkpunt. In een latere fase is de baan met handmatige tests en Kruinconfig via Been doorgetrokken naar A-Hiel. Been en Hiel heten in deze cursus samen de Uitloop. Beschouw de Uitloop als een geteste uitbreiding, niet als het oorspronkelijke midden-ijkpunt."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp","kruis","been","hiel"], focusProfile: "les1", role: "middle-reference-and-tested-extension", endZone: "M", testedExtension: ["been","hiel.to"] }
          },
          {
            key: "lesson-waaier",
            title: { en: "Lesson · Fan", nl: "Les · Waaier" },
            text: {
              en: "Choose Fan for the whole and HALF tracks. A HALF track lies exactly midway between its two neighbouring tracks for every known value.",
              nl: "Kies Waaier om door de waaierstanden te gaan: basisspoor, HALF-stand en volgend spoor. De HALF-stand ligt voor iedere bekende waarde exact midden tussen de twee buursporen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp","kruis"] }
          },
          {
            key: "lesson-minus-start-plus",
            title: { en: "Lesson · Parallel (P)", nl: "Les · Parallel (P)" },
            text: {
              en: "Choose Parallel (P) for parallel tracks. In/Out reverses the side: S+ starts inside and Body A arrives outside, so its South value decreases. S− works inversely. Body, Neck and Head are then calculated backwards parallel to the base track.",
              nl: "Kies Parallel (P) voor parallelstanden rond het basisspoor. BiBu keert de zijde om: S+ begint binnen en A-Romp komt buiten aan, waardoor de Zuidwaarde daalt. S− werkt omgekeerd. Romp, Nek en Kop worden daarna parallel aan het basisspoor teruggerekend."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"] }
          },
          {
            key: "lesson-minus-start-plus-display",
            title: { en: "Lesson · View Parallel (P)", nl: "Les · Parallel (P) bekijken" },
            text: {
              en: "Choose Static · whole track to see the complete chosen ± track. Line by line retains the current track but starts again at Nose. The complete thin base track always remains fixed. In table view, − stays on the left and + on the right. Tap the centre to switch between Track and Line. The central menu also has Back to base track, for example FIVE+2 → FIVE.",
              nl: "Kies Statisch · heel spoor om het volledige gekozen ±spoor te zien. Lijn voor lijn behoudt het huidige spoor, maar begint opnieuw bij Neus. Het volledige dunne basisspoor blijft altijd vast staan. In tafelbeeld blijft − links en + rechts. Tik in het midden om tussen Spoor en Lijn te wisselen. In het centrale menu staat ook Terug naar basisspoor, bijvoorbeeld VIJF+2 → VIJF."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"], role: "parallel-display-modes" }
          },
          {
            key: "lesson-line-by-line-reset",
            title: { en: "Lesson · Restart and base track", nl: "Les · Herstart en basisspoor" },
            text: {
              en: "When you choose Line by line, the current track remains selected and the comparison restarts at Nose. Use Back to base track in the central menu only when you also want to remove the −/+ offset, for example FIVE+2 → FIVE. That action also restarts at Nose.",
              nl: "Wanneer je Lijn voor lijn kiest, blijft het huidige spoor geselecteerd en begint de vergelijking opnieuw bij Neus. Gebruik Terug naar basisspoor in het centrale menu alleen wanneer ook de −/+ verschuiving weg moet, bijvoorbeeld VIJF+2 → VIJF. Ook die actie begint opnieuw bij Neus."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp"], role: "line-reset-base-track" }
          },
          {
            key: "diamond-lines",
            title: { en: "Every cushion has its own diamond line", nl: "Iedere band heeft een eigen stiplijn" },
            text: {
              en: "A diamond line is the measuring line along one cushion that connects its diamonds. The four cushions therefore have four separate diamond lines. V and A always refer to one of these lines, never to the cushion edge.",
              nl: "Een stiplijn is de meetlijn langs één band die de stippen van die band verbindt. De vier banden hebben dus vier afzonderlijke stiplijnen. V en A verwijzen altijd naar zo'n stiplijn, nooit naar de bandrand."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "running-or-reverse",
            title: { en: "+ running · − reverse", nl: "+ mee · − contra" },
            text: {
              en: "A line starts as + (running). If the ball and therefore the line skip a cushion, the framework changes and the state switches to − (reverse). That state continues until another cushion is skipped. In Track FOUR, Body East–West causes the switch; Cross West–South remains reverse. In Track FIVE, the first switch occurs at Leg West–East.",
              nl: "Een lijn begint op + (mee). Slaan de bal en dus de lijn een band over, dan verandert het Karkas en schakelt de loop naar − (contra). Die stand blijft gelden tot een volgende bandoverslag. Bij VIER veroorzaakt Romp Oost–West de omschakeling; Kruis West–Zuid blijft contra. Bij VIJF gebeurt de eerste omschakeling bij Been West–Oost."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["kruis","been"] }
          },
          {
            key: "rule-direction",
            title: { en: "Rule · Dir", nl: "Regel · Dir" },
            text: {
              en: "Dir records the cushion order. Every A names the next cushion, but the order can differ by track. Track FIVE uses S–W–N–E–S–W–E–N. Track FOUR uses S–W–N–E–W–S–E–N.",
              nl: "Dir noteert de bandvolgorde. Iedere A noemt de volgende band, maar de volgorde kan per spoor verschillen. Spoor VIJF gebruikt S–W–N–O–Z–W–O–N. Spoor VIER gebruikt S–W–N–O–W–Z–O–N."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"] }
          },
          {
            key: "track-four-body-cross",
            title: { en: "Track FOUR · East to West", nl: "Spoor VIER · Oost naar West" },
            text: {
              en: "In Track FOUR, Body runs directly from East to West. At the same ball on the West cushion, Cross takes over and runs with reverse English toward the South cushion. After Cross, the Run-out follows: Leg + Heel. The configured Cross angle determines the exact South arrival.",
              nl: "In Spoor VIER loopt Romp rechtstreeks van Oost naar West. Op dezelfde bal aan de Westband neemt Kruis over en loopt met contra-effect naar de Zuidband. Na Kruis volgt de Uitloop: Been + Hiel. De geconfigureerde Kruishoek bepaalt de precieze aankomst op Zuid."
            },
            image: { source: "KruinLines", line: "VIER", parts: ["romp","kruis","been","hiel"], tables: ["klein","groot"], focusProfile: "actieveLijn", emphasize: "romp-kruis", loop: "-" }
          },
          {
            key: "rule-reflection",
            title: { en: "Rule · incidence equals reflection", nl: "Regel · hoek van inval is hoek van uitval" },
            text: {
              en: "For every LSL track, Heel is provisionally derived by reflecting Leg at the East cushion: the angle of incidence equals the angle of reflection. Heel remains reverse until a later cushion skip changes the state.",
              nl: "Voor ieder LKL-spoor wordt Hiel voorlopig afgeleid door Been op de Oostband te spiegelen: hoek van inval is hoek van uitval. Hiel blijft contra totdat een latere bandoverslag de stand verandert."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["been","hiel"] }
          },
          {
            key: "rule-bibu",
            title: { en: "Rule · In/Out", nl: "Regel · BiBu" },
            text: {
              en: "In/Out describes the relation between departure and Body arrival. S+1 starts inside and arrives outside on the South cushion; S−1 starts outside and arrives inside.",
              nl: "BiBu beschrijft de relatie tussen start en Romp A. S+1 begint binnen (Bi) en komt op de Zuidband buiten (Bu) aan; S−1 begint buiten en komt binnen aan."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"] }
          },
          {
            key: "rule-small-arrival-row",
            title: { en: "All balls together!", nl: "Alle ballen verzamelen!" },
            text: {
              en: "Choose Parallel (P) and Arrivals. Only the base Body line is shown, with every S−2 through S+2 arrival ball physically against cushion 4 (South). On the Small table they form a row of five exactly adjacent balls. For other lines or tables, the balls may touch, overlap or lie apart.",
              nl: "Kies Parallel (P) en Aankomsten. Je ziet alleen de basisromp met op Romp A alle aankomstballen van S−2 tot en met S+2 werkelijk tegen band 4 (Zuid). Op Klein vormen zij een rij van vijf ballen die precies naast elkaar liggen. Bij andere lijnen of tafels kunnen de ballen naast elkaar liggen, overlappen of uit elkaar liggen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["romp"], tables: ["klein"], showArrivalSeries: true, offsets: [-2,-1,0,1,2] }
          },
          {
            key: "head-neck-experience-anchors",
            title: { en: "Experience anchors · Head and Neck", nl: "Ervaringsankers · Kop en Nek" },
            text: {
              en: "Small Head A: FOUR N28, FIVE N19, SIX N10. Large Head A / Neck A: FOUR N25 / E10, FIVE N15 / E20, SIX N10 / E30. Head A is also the starting anchor for the shortened four-cushion route.",
              nl: "Klein Kop A: VIER N28, VIJF N19, ZES N10. Groot Kop A / Nek A: VIER N25 / O10, VIJF N15 / O20, ZES N10 / O30. Kop A is ook het uitgangsanker voor de verkorte vierbander."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["kop","nek"], tables: ["groot","klein"] }
          },
          {
            key: "rule-position-to-line",
            title: { en: "Rule · Position to line", nl: "Regel · Positie naar lijn" },
            text: {
              en: "Starting from a known position on the current line, determine which next line must be played. First application: Body A determines Cross, departing at 45 degrees. More position-to-line relations will be added later.",
              nl: "Ga uit van een bekende positie op de huidige lijn en bepaal welke volgende lijn gespeeld moet worden. Eerste toepassing: Romp A bepaalt Kruis, dat onder 45 graden vertrekt. Meer positie-naar-lijnrelaties volgen later."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["romp","kruis"] }
          },
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
              nl: "A is aankomst en V is vertrek. Iedere waarde verwijst naar een stip en de bijbehorende stiplijn. Een stiplijn loopt langs één band en verbindt de stippen van die band; iedere band heeft een eigen stiplijn. De bandrand blijft zichtbaar, maar is nooit de meetlijn."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "shift",
            title: { en: "Shift names the next line", nl: "Schuif benoemt de volgende lijn" },
            text: {
              en: "SHIFT moves the complete line setup. FIVE can become SIX, and the same naming extends to ZERO and later lines. The line—not one diamond—is the unit.",
              nl: "SCHUIF verplaatst de volledige spooropzet. Spoor VIJF wordt zo Spoor ZES; dezelfde naamgeving geldt ook voor Spoor NUL en latere sporen. Het spoor—niet één stip of lijnstuk—is de eenheid."
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
      defaultLengthsCm: { klein: { VIJF:83 } },
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
        includes: ["ball"],
        paddingSvg: 0,
        showOutline: true
      },
      valueWindow: {
        outsideWoodGapSvg: 3,
        widthSvg: 100,
        heightSvg: 54,
        cornerRadiusSvg: 9,
        fontSizeSvg: 13
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
      showPointType: true,
      suppressNearestTenInReplacementMode: true
    }
  },
  shotLines: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT","NEGEN","TIEN","ELF","TWAALF"],
  trackRoutes: {
    NUL: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    EEN: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    TWEE: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    DRIE: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    VIER: { startLabel: "S", arrivals: ["west","noord","oost","west","zuid","oost","noord"], rule: "each_arrival_selects_the_next_cushion", note: "body_east_to_west_then_cross_reverse_west_to_south" },
    VIJF: {
      startLabel: "S",
      arrivals: ["west","noord","oost","zuid","west","oost","noord"],
      rule: "each_arrival_selects_the_next_cushion"
    },
    ZES: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    ZEVEN: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    ACHT: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" }
  },
  lklTrackRules: {
    appliesTo: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT"],
    panelTracks: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT"],
    noseArrivalByTrack: { NUL:0, EEN:10, TWEE:20, DRIE:30, VIER:40, VIJF:50, ZES:60, ZEVEN:70, ACHT:80 },
    route: ["S","W","N","O","Z","W","O","N"],
    routeByTrack: { VIER:["S","W","N","O","W","Z","O","N"] },
    cross: { defaultAngleDegrees:45, defaultArrivalBand:"west", defaultLoop:"+", configurablePerTableAndTrack:true, rule:"depart_from_body_arrival_and_follow_configured_angle_to_configured_arrival_band" },
    leg: { to:{band:"oost",value:10,fixed:true}, from:{rule:"derive_from_cross_arrival"} },
    heel: { from:{band:"oost",rule:"shared_with_leg_arrival"}, to:{band:"noord",rule:"angle_of_incidence_equals_angle_of_reflection"} },
    experienceAnchors: {
      klein: {
        VIER: { headArrival:{band:"noord",value:28} },
        VIJF: { headArrival:{band:"noord",value:19} },
        ZES: { headArrival:{band:"noord",value:10} }
      },
      groot: {
        VIER: { headArrival:{band:"noord",value:25}, neckArrival:{band:"oost",value:10} },
        VIJF: { headArrival:{band:"noord",value:15}, neckArrival:{band:"oost",value:20} },
        ZES: { headArrival:{band:"noord",value:10}, neckArrival:{band:"oost",value:30} }
      },
      shortenedFourCushion: "use_head_arrival_as_starting_anchor"
    },
    loop: { initial:"+", toggleOnSkippedCushion:true, persistUntilNextSkippedCushion:true }
  },
  trackSpecs: {
    VIJF: {
      complete: true,
      tables: ["klein","groot"],
      loop: {
        default: "+",
        defaultMeaning: "mee",
        skippedCushion: "-",
        skippedCushionMeaning: "contra",
        rule: "use_contra_when_from_and_to_skip_an_intermediate_cushion"
      },
      parts: {
        neus: {
          fixed: true,
          from: { kind: "acquit", value: "S" },
          to: { band: "west", value: 50 }
        },
        romp: {
          source: "Kruin",
          defaultByTable: {
            klein: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 38 } },
            groot: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 36 } }
          }
        },
        kruis: {
          defaultAngleDegrees: 45,
          configurablePerTableAndTrack: true,
          rule: "derive_from_body_arrival"
        },
        been: {
          to: { band: "oost", value: 10, fixed: true },
          from: { band: "west", rule: "derive_from_cross_arrival" },
          loop: "-"
        },
        hiel: {
          from: { band: "oost", rule: "shared_with_leg_arrival" },
          to: { band: "noord", rule: "angle_of_incidence_equals_angle_of_reflection" },
          loop: "-"
        }
      }
    }
  },
  rules: {
    Dir: {
      labels: { en: "Direction", nl: "Richting" },
      rule: "each_arrival_names_the_next_cushion",
      five: ["S","W","N","O","Z","W","O","N"]
    },
    Loop: {
      labels: { en: "Running / reverse", nl: "Mee / contra" },
      initial: "+",
      toggleOnSkippedCushion: true,
      persistUntilNextSkippedCushion: true,
      skippedCushionPairs: [["west","oost"],["oost","west"],["noord","zuid"],["zuid","noord"]],
      skeletonConsequence: "a_skipped_cushion_changes_the_framework_and_switches_running_reverse_state",
      note: "Track FOUR Body east_to_west switches to reverse; Cross west_to_south inherits reverse"
    },
    Reflection: {
      labels: { en: "Angle of incidence equals angle of reflection", nl: "Hoek van inval is hoek van uitval" },
      appliesTo: ["hiel"],
      status: "provisional"
    },
    PositionToLine: {
      labels: { en: "Position to line", nl: "Positie naar lijn" },
      rule: "a_known_position_on_the_current_line_determines_the_next_line_to_play",
      applications: [
        { from:{part:"romp",point:"A"}, to:{part:"kruis",departureAngleSource:"Kruinconfig.crossAngleDeg",defaultDegrees:45} }
      ],
      status: "extend_in_explanation_later"
    },
    BiBu: {
      labels: { en: "In/Out", nl: "BiBu" },
      relation: "opposite_sides",
      plus: { departure:"inside", bodyArrival:"outside", southDiamondDirection:"minus" },
      minus: { departure:"outside", bodyArrival:"inside", southDiamondDirection:"plus" }
    },
    SmallLklArrivalRow: {
      table: "klein",
      departureOffsets: [-2,-1,0,1,2],
      arrivalBand: "zuid",
      appearance: "adjacent_ball_row"
    }
  },
  lineOneVariants: {
    defaultMode: "basis",
    modes: ["basis", "parallel", "waaier"],
    parallel: {
      minimumOffset: -2,
      maximumOffset: 8,
      defaultOffset: 0,
      longRailUnitsPerStep: 10,
      startLabel: "S",
      startAxis: "vertical_centerline",
      arrivalConstraint: { band:"west", minimum:0, maximum:80 },
      bodyArrivalByTable: {
        klein: { band:"zuid", ballWidthsPerStep:1, ballDiameterCm:6.15, diamondUnitsPerStep:6.15/115*40, offsetSign:-1 },
        groot: { band:"zuid", ballWidthsPerStep:1.5, ballDiameterCm:6.15, diamondUnitsPerStep:1.5*6.15/142*40, offsetSign:-1 }
      },
      backwardFromBodyArrival: {
        parts: ["romp","nek","kop"],
        rule: "keep_each_part_parallel_to_its_base_track"
      },
      rule: "BiBu: plus_start_inside_body_A_outside_so_south_value_decreases; minus_is_inverse; then_body_neck_head_recalculate_backward"
    },
    fan: {
      rule: "every_known_value_is_midpoint_of_adjacent_tracks",
      entries: [
        { key:"HALFEEN", between:["NUL","EEN"], noseArrival:5, fraction:0.5 },
        { key:"HALFTWEE", between:["EEN","TWEE"], noseArrival:15, fraction:0.5 },
        { key:"HALFDRIE", between:["TWEE","DRIE"], noseArrival:25, fraction:0.5 },
        { key:"HALFVIER", between:["DRIE","VIER"], noseArrival:35, fraction:0.5 },
        { key:"HALFVIJF", between:["VIER","VIJF"], noseArrival:45, fraction:0.5 },
        { key:"HALFZES", between:["VIJF","ZES"], noseArrival:55, fraction:0.5 },
        { key:"HALFZEVEN", between:["ZES","ZEVEN"], noseArrival:65, fraction:0.5 },
        { key:"HALFACHT", between:["ZEVEN","ACHT"], noseArrival:75, fraction:0.5 }
      ]
    }
  },
  patternByLine: { NUL:"LKL", EEN:"LKL", TWEE:"LKL", DRIE:"LKL", VIER:"LKL", VIJF:"LKL", ZES:"LKL", ZEVEN:"LKL", ACHT:"LKL" },
  patternLabels: {
    NUL:{en:"ZERO",nl:"NUL"}, EEN:{en:"ONE",nl:"EEN"}, TWEE:{en:"TWO",nl:"TWEE"}, DRIE:{en:"THREE",nl:"DRIE"}, VIER:{en:"FOUR",nl:"VIER"},
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
    neus:{from:"V",to:"west"}, kop:{from:"west",to:"noord"},
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
    restrictionsEnabled:false,
    wrap:true,
    integerStep:1,
    overrides:{}
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
    klein:{
    VIER:{romp:{from:{band:"oost",value:5},to:{band:"zuid",value:70}}},
    VIJF:{
      neus:{from:{kind:"acquit",value:"S"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:35,status:"calculated"},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:13,status:"calculated"},to:{band:"oost",value:32,status:"calculated"}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}},
      kruis:{from:{band:"zuid",value:31,status:"calculated"},to:{band:"west",value:10}},
      been:{from:{band:"west",value:null,status:"calculated"},to:{band:"oost",value:10,status:"approved"}}
    },
    ZES:{romp:{from:{band:"oost",value:30},to:{band:"zuid",value:30}}},
    ZEVEN:{romp:{from:{band:"oost",value:35},to:{band:"zuid",value:20}}},
    ACHT:{romp:{from:{band:"oost",value:43},to:{band:"zuid",value:19}}}
    },
    groot:{
    VIJF:{
      neus:{from:{kind:"acquit",value:"S"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:null,status:"calculated"},to:{band:"noord",value:15,status:"approved"}},
      nek:{from:{band:"noord",value:null,status:"calculated"},to:{band:"oost",value:20,status:"approved"}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:36}},
      been:{from:{band:"west",value:null,status:"calculated"},to:{band:"oost",value:10,status:"approved"}}
    },
    ZES:{romp:{from:{band:"oost",value:30},to:{band:"zuid",value:28}}},
    ZEVEN:{romp:{from:{band:"oost",value:37},to:{band:"zuid",value:22}}},
    ACHT:{romp:{from:{band:"oost",value:48},to:{band:"zuid",value:18}}}
    }
  }
};

return {id:"kruin-v173-56b6390733b1fe5dba58",label:"Kruin v173 · Kruinconfig",config:window.THREEB_START_CONFIG,values:{"onscreenMenu":{"groups":{"edit":{"order":20,"visible":true,"zone":"bottom"},"menuPanel":{"order":30,"visible":true,"zone":"bottom"},"menuToggle":{"order":10,"visible":true,"zone":"bottom"},"next":{"order":10,"visible":true,"zone":"right"},"previous":{"order":10,"visible":true,"zone":"left"},"track":{"order":10,"visible":true,"zone":"top"}},"safeGapPx":10,"zones":["top","left","right","bottom"]},"release":173,"savedSpoorValues":[],"source":"Kruinconfig-3B-v173.ods","tracks":{"groot":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":18},"rompV":{"band":"oost","value":48}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":20.599},"rompV":{"band":"oost","value":44}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.197},"rompV":{"band":"oost","value":39}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":20},"rompV":{"band":"oost","value":42.5}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":15},"neusA":{"band":"west","value":45}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12.5},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":32},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":33.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":40}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":15},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":36},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":6},"nekA":{"band":"oost","value":32},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":33.401},"rompV":{"band":"oost","value":24}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":36},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":30.803},"rompV":{"band":"oost","value":28}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":41},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":28.204},"rompV":{"band":"oost","value":33}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":24},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":38.599},"rompV":{"band":"oost","value":16}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":41.197},"rompV":{"band":"oost","value":12}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":28},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":43},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":25.401},"rompV":{"band":"oost","value":34}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":48},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":22.803},"rompV":{"band":"oost","value":39}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":30.599},"rompV":{"band":"oost","value":26}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":33.197},"rompV":{"band":"oost","value":21}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":22},"rompV":{"band":"oost","value":37}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19.401},"rompV":{"band":"oost","value":42}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":24.599},"rompV":{"band":"oost","value":32}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":27.197},"rompV":{"band":"oost","value":27}}},"klein":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":2},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19},"rompV":{"band":"oost","value":43}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":21.14},"rompV":{"band":"oost","value":39}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.278},"rompV":{"band":"oost","value":35}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":19.5},"rompV":{"band":"oost","value":39}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":23.5},"neusA":{"band":"west","value":45},"rompA":{"band":"zuid","value":54},"rompV":{"band":"oost","value":12.5}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":14.5},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":34},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":32.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":28},"neusA":{"band":"west","value":40},"rompA":{"band":"west","value":10},"rompV":{"band":"oost","value":10}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":14},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":67.861},"rompV":{"band":"oost","value":7}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":17},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":65.722},"rompV":{"band":"oost","value":10}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":19},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":63.583},"rompV":{"band":"oost","value":12}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":32},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":72.14},"rompV":{"band":"oost","value":3}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":36},"nekA":{"band":"oost","value":7},"neusA":{"band":"west","value":20},"rompA":{"band":"zuid","value":74.278},"rompV":{"band":"oost","value":0}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":19},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":38},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":35.861},"rompV":{"band":"oost","value":23}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":13},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":33.722},"rompV":{"band":"oost","value":27}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":42},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":31.583},"rompV":{"band":"oost","value":30}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":22},"nekA":{"band":"oost","value":29},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":40.14},"rompV":{"band":"oost","value":17}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":42.278},"rompV":{"band":"oost","value":13}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":30},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":7},"nekA":{"band":"oost","value":45},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":27.861},"rompV":{"band":"oost","value":33}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":49},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":25.722},"rompV":{"band":"oost","value":37}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":32.14},"rompV":{"band":"oost","value":27}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":34.278},"rompV":{"band":"oost","value":23}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":23},"rompV":{"band":"oost","value":35}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":17.861},"rompV":{"band":"oost","value":39}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":22.14},"rompV":{"band":"oost","value":31}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":24.278},"rompV":{"band":"oost","value":26}}}}}};})());
globalThis.THREEB_BASES.push((()=>{const window={};
window.THREEB_START_CONFIG = {
  version: 101, release: "174", publicRelease: "174",
  userDisplay: {
    defaultLineOpacity: 0.58,
    defaultArrowMode: "request",
    defaultArrowScale: 0.35,
    defaultValueLabelMode: "on",
    valueLabelModes: ["on", "off"],
    defaultValueLabelScale: 0.75,
    valueLabelScaleRange: { minimum: 0.65, maximum: 1, step: 0.05 },
    valueLabelBaseFontPx: 12,
    lineOpacityRange: { minimum: 0.3, maximum: 1, step: 0.05 },
    arrowScaleRange: { minimum: 0.35, maximum: 1.2, step: 0.05 }
  },
  onscreenMenu: {
    menuButtonPosition: "corner", // "corner" of "central"
    safeGapPx: 10,
    zones: ["top", "left", "right", "bottom"],
    groups: {
      track: { zone: "top", order: 10, visible: true },
      previous: { zone: "left", order: 10, visible: true },
      next: { zone: "right", order: 10, visible: true },
      menuToggle: { zone: "bottom", order: 10, visible: true },
      edit: { zone: "bottom", order: 20, visible: true },
      menuPanel: { zone: "bottom", order: 30, visible: true }
    }
  },
  tableOrientation: {
    label: "Canoniek rechtop",
    canonicalAxes: { north: "top", south: "bottom", west: "left", east: "right" },
    allowVisualRotation: false,
    eastWest: {
      desktop: false,
      mobileLandscape: true,
      mobilePortrait: false
    }
  },
  tablePanel: {
    draggable: true,
    autoAvoidTouchedLine: true,
    defaultX: 0,
    defaultY: 0,
    maximumOffsetXPercent: 38,
    maximumOffsetYPercent: 36,
    appearance: {
      background: "#167555",
      foreground: "#fff8e8",
      border: "#f4cf66",
      minimumWidthPx: 132,
      paddingHorizontalPx: 6,
      paddingVerticalPx: 5,
      controlSizePx: 31,
      hitSlopPx: 6,
      labelFontPx: 10,
      valueFontPx: 13
    }
  },
  seriesOverview: {
    toggleOnStartBall: true,
    showFanNoses: true,
    showParallelTracks: true,
    includeHalfPositions: true,
    inactiveOpacity: 0.34,
    inactiveWidthSvg: 1.6,
    activeWidthSvg: 5,
    defaultFocus: "basis",
    allowUserFocusChoice: true,
    allowCourseOverride: true,
    focusProfiles: {
      basis: {
        labels: { nl: "Neus + Romp", en: "Nose + Body" },
        parts: ["neus", "romp"], activeWideParts: ["romp"], showArrivals: false
      },
      noord: {
        labels: { nl: "Noordband · Kop + Nek", en: "North cushion · Head + Neck" },
        parts: ["kop", "nek"], activeWideParts: ["kop", "nek"], showArrivals: false
      },
      actieveLijn: {
        labels: { nl: "Actieve lijn", en: "Active line" },
        parts: ["$active"], activeWideParts: ["$active"], showArrivals: false
      },
      alleLijnen: {
        labels: { nl: "Alle lijnen", en: "All lines" },
        parts: ["$all"], activeWideParts: ["$active"], showArrivals: false
      },
      aankomsten: {
        labels: { nl: "Neus + Romp · aankomsten", en: "Nose + Body · arrivals" },
        parts: ["neus", "romp"], activeWideParts: ["romp"], showArrivals: true
      }
    },
    courseFocusProfiles: {
      les1: "basis",
      noordband: "noord",
      aankomsten: "aankomsten"
    }
  },
  userAccess: {
    defaultAddressForm: "jij",
    addressForms: ["jij", "u"],
    requireEmailForEditing: true,
    supabase: {
      paymentEnabled: false,
      paymentUrl: "",
      paymentAnonKey: "",
      url: "",
      anonKey: "",
      table: "user_tables",
      mollieFunction: "create-mollie-payment",
      sessionFunction: "record_app_session"
    },
    sessionTracking: {
      enabled: true,
      heartbeatSeconds: 30
    },
    storageModes: ["account"],
    defaultStorageMode: "account",
    barTab: {
      enabled: true,
      currency: "EUR",
      items: [
        { key: "nul", labels: { nl: "€0", en: "€0" }, amount: "0.00" },
        { key: "spa_rood", labels: { nl: "Spa rood voor straks", en: "Sparkling water for later" }, amount: "2.50" },
        { key: "bitterballen", labels: { nl: "Rondje bitterballen!", en: "A round of bitterballen!" }, amount: "8.00" }
      ]
    }
  },
  terminology: {
    pattern: { key: "LKL", en: "long-short-long", nl: "lang-kort-lang" },
    trackName: {
      default: "spoor",
      choices: {
        spoor: { singular: { en: "Track", nl: "Spoor" }, plural: { en: "Tracks", nl: "Sporen" } },
        lijn: { singular: { en: "Line", nl: "Lijn" }, plural: { en: "Lines", nl: "Lijnen" } },
        patroon: { singular: { en: "Pattern", nl: "Patroon" }, plural: { en: "Patterns", nl: "Patronen" } }
      }
    },
    line: { en: "Line", nl: "Lijn" },
    part: { en: "Part", nl: "Deel" },
    firstLine: { en: "Line 1 · departure line", nl: "Lijn 1 · afstootlijn" },
    glossary: {
      baseTrack: { en:"Base track", nl:"Basisspoor" },
      fan: { en:"Fan", nl:"Waaier" },
      fanPosition: { en:"Fan position", nl:"Waaierstand" },
      halfPosition: { en:"HALF position", nl:"HALF-stand" },
      parallelSeries: { en:"Parallel (P)", nl:"Parallel (P)" },
      parallelPosition: { en:"Parallel position", nl:"Parallelstand" },
      arrivalsView: { en:"Arrivals view", nl:"Aankomstenweergave" }
    },
    diamondLine: {
      en: "Diamond line: the measuring line along one cushion that connects its diamonds. Every cushion has its own diamond line.",
      nl: "Stiplijn: de meetlijn langs één band die de stippen van die band verbindt. Iedere band heeft een eigen stiplijn."
    }
  },
  defaultLanguage: "nl", defaultTableMode: "groot", defaultDirection: "west", defaultDeparture: "neus",
  editor: {
    defaultMode: "basis",
    modes: ["basis","alle"],
    lklBasicParts: ["neus","romp"],
    compactBallValueEditor: true,
    liveUpdate: true,
    openGesture: "single_click_or_tap"
  },
  courseCases: [
    {
      key: "case-five-minus-one-start", ownerOnly: true, scope: "lijn_tafel", level: "Kruin-cases", table: "klein", line: "VIJF",
      title: { en: "Case 1 · choose the track", nl: "Case 1 · kies het spoor" },
      text: { en: "Ball 2 is at this course position. Which track do you play?", nl: "Bal 2 ligt op deze cursuspositie. Welk spoor speel je?" },
      answer: { en: "Track FIVE−1.", nl: "Spoor VIJF−1." },
      case: { targetBall: 2, position: { kind: "parallelStart", baseTrack: "VIJF", offset: -1 } },
      image: { source: "KruinLines", line: "VIJF", parts: [], tables: ["klein"], casePositionOnly: true }
    }
  ],
  explanation: {
    version: "0.7",
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
        labels: { en: "Lesson 1 · Track FIVE", nl: "Les 1 · Spoor VIJF" },
        description: {
          en: "Track FIVE only: Line 1 Nose + Line 4 Body, using the Kruin image.",
          nl: "Alleen Spoor VIJF: Lijn 1 Neus + Lijn 4 Romp, volgens het Kruinbeeld."
        },
        slides: [
          {
            key: "route-names-three-minus-plus",
            title: { en: "The complete route", nl: "De volledige balbaan" },
            text: {
              en: "The route is named Nose, Head, Neck, Body, Cross, Leg, Heel, Foot and Toe. Leg could also have been called Tail. In this course, Leg and Heel together are called the Run-out. Nose, Head and Neck introduce the run-up below three cushions. Route choices for the target ball start at Body: three cushions or more.",
              nl: "De balbaan heet Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen. Been had ook Staart mogen heten. In de cursus heten Been en Hiel samen de Uitloop. Neus, Kop en Nek introduceren de aanloop onder drie banden. De routekeuze voor de doelbal begint bij Romp: drie banden of meer."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel","voet","teen"], tables: ["klein"] }
          },
          {
            key: "nose-reference-and-user",
            title: { en: "Kruin Nose and User Nose", nl: "Kruinneus en Gebruikersneus" },
            text: {
              en: "Kruin configures a reference Nose for every track. Make ball 1 arrive rolling at cushion 1. If ball 1 does not align with the target-ball track, cautiously change the Nose direction, play several attempts and record your local User Nose. A short Nose usually needs only a small correction, but that small correction can have large consequences. A longer Nose may require a larger correction. Do not assume: measure.",
              nl: "Kruin configureert per spoor een Kruinneus als referentie. Laat bal 1 rollend aankomen op band 1. Strookt bal 1 niet met het spoor van de doelbal, verander dan voorzichtig de richting van de Neus, speel meerdere pogingen en bewaar lokaal de Gebruikersneus. Een korte Neus vraagt meestal slechts een kleine correctie, maar die kleine correctie kan grote gevolgen hebben. Bij een langere Neus kan een grotere correctie nodig zijn. Neem niets aan: meet."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus"], tables: ["klein"] }
          },
          {
            key: "find-target-track",
            title: { en: "1 · Which track is my target ball on?", nl: "1 · Op welk spoor ligt mijn doelbal?" },
            text: {
              en: "First look only at ball 2: which 3+ route is it on? Only Body (3 cushions) and the later route parts are offered. More than one track may fit. Choose one or more candidates and compare them.",
              nl: "Kijk eerst alleen naar bal 2: op welke 3+-route ligt mijn doelbal? Alleen Romp (3 banden) en de volgende delen worden aangeboden. Er kunnen meerdere sporen passen. Kies één of meer kandidaten en vergelijk ze."
            },
            image: {
              source: "KruinLines", line: "VIJF", parts: ["neus","romp"], tables: ["klein"], focusProfile: "les1",
              targetBall: { number: 2, position: { kind: "parallelStart", baseTrack: "VIJF", offset: -1 } },
              allowMultipleTracks: true
            }
          },
          {
            key: "body-user-as-is",
            title: { en: "Track FIVE · your own stroke", nl: "Spoor VIJF · je eigen afstoot" },
            text: {
              en: "Use the Kruin image of Nose + Body. Play the Nose with your own current delivery and record the Body's arrival line in the app. Further instructions on assessing that arrival line will follow later.",
              nl: "Gebruik het Kruinbeeld van Neus + Romp. Stoot de Neus af met je huidige eigen afstoot en noteer in de app de aankomstlijn van de Romp. Verdere instructie over het beoordelen van die aankomstlijn volgt later."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], focusProfile: "les1", role: "user-as-is", recordBodyArrivalLine: true }
          },
          {
            key: "body-kruin-reference",
            title: { en: "Track FIVE · Kruin reference", nl: "Spoor VIJF · Kruinreferentie" },
            text: {
              en: "For a Kruin track, use maximum English, the mid-high contact tangent shown as the shadow line, and finishing zone M at the centre of the table. This defines Kruin Track FIVE, SIX, SEVEN or EIGHT.",
              nl: "Voor een Kruinspoor gelden: maximaal effect, de raaklijn middenhoog als schaduwlijn en eindzone M in het midden van de tafel. Dit bepaalt Kruinspoor VIJF, ZES, ZEVEN of ACHT."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], focusProfile: "les1", role: "kruin-reference", effect: "maximum", contactTangent: "mid-high", showShadowLine: true, endZone: "M", endZonePosition: "table-centre" }
          },
          {
            key: "standard-shot-middle-and-extension",
            title: { en: "First the middle, then the Run-out", nl: "Eerst het midden, daarna de Uitloop" },
            text: {
              en: "The standard stroke is based on letting ball 1 roll out toward the middle of the table. That middle zone is the first reference. In a later phase, the route was extended through Leg to Heel A using manual table tests and Kruin configuration. In this course, Leg and Heel together are called the Run-out. Treat the Run-out as a tested extension, not as the original middle reference.",
              nl: "De standaardstoot is gebaseerd op het uitrollen van bal 1 naar de middenzone van het biljart. Die middenzone is het eerste ijkpunt. In een latere fase is de baan met handmatige tests en Kruinconfig via Been doorgetrokken naar A-Hiel. Been en Hiel heten in deze cursus samen de Uitloop. Beschouw de Uitloop als een geteste uitbreiding, niet als het oorspronkelijke midden-ijkpunt."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp","kruis","been","hiel"], focusProfile: "les1", role: "middle-reference-and-tested-extension", endZone: "M", testedExtension: ["been","hiel.to"] }
          },
          {
            key: "lesson-waaier",
            title: { en: "Lesson · Fan", nl: "Les · Waaier" },
            text: {
              en: "Choose Fan for the whole and HALF tracks. A HALF track lies exactly midway between its two neighbouring tracks for every known value.",
              nl: "Kies Waaier om door de waaierstanden te gaan: basisspoor, HALF-stand en volgend spoor. De HALF-stand ligt voor iedere bekende waarde exact midden tussen de twee buursporen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp","kruis"] }
          },
          {
            key: "lesson-minus-start-plus",
            title: { en: "Lesson · Parallel (P)", nl: "Les · Parallel (P)" },
            text: {
              en: "Choose Parallel (P) for parallel tracks. In/Out reverses the side: S+ starts inside and Body A arrives outside, so its South value decreases. S− works inversely. Body, Neck and Head are then calculated backwards parallel to the base track.",
              nl: "Kies Parallel (P) voor parallelstanden rond het basisspoor. BiBu keert de zijde om: S+ begint binnen en A-Romp komt buiten aan, waardoor de Zuidwaarde daalt. S− werkt omgekeerd. Romp, Nek en Kop worden daarna parallel aan het basisspoor teruggerekend."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"] }
          },
          {
            key: "lesson-minus-start-plus-display",
            title: { en: "Lesson · View Parallel (P)", nl: "Les · Parallel (P) bekijken" },
            text: {
              en: "Choose Static · whole track to see the complete chosen ± track. Line by line retains the current track but starts again at Nose. The complete thin base track always remains fixed. In table view, − stays on the left and + on the right. Tap the centre to switch between Track and Line. The central menu also has Back to base track, for example FIVE+2 → FIVE.",
              nl: "Kies Statisch · heel spoor om het volledige gekozen ±spoor te zien. Lijn voor lijn behoudt het huidige spoor, maar begint opnieuw bij Neus. Het volledige dunne basisspoor blijft altijd vast staan. In tafelbeeld blijft − links en + rechts. Tik in het midden om tussen Spoor en Lijn te wisselen. In het centrale menu staat ook Terug naar basisspoor, bijvoorbeeld VIJF+2 → VIJF."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"], role: "parallel-display-modes" }
          },
          {
            key: "lesson-line-by-line-reset",
            title: { en: "Lesson · Restart and base track", nl: "Les · Herstart en basisspoor" },
            text: {
              en: "When you choose Line by line, the current track remains selected and the comparison restarts at Nose. Use Back to base track in the central menu only when you also want to remove the −/+ offset, for example FIVE+2 → FIVE. That action also restarts at Nose.",
              nl: "Wanneer je Lijn voor lijn kiest, blijft het huidige spoor geselecteerd en begint de vergelijking opnieuw bij Neus. Gebruik Terug naar basisspoor in het centrale menu alleen wanneer ook de −/+ verschuiving weg moet, bijvoorbeeld VIJF+2 → VIJF. Ook die actie begint opnieuw bij Neus."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp"], role: "line-reset-base-track" }
          },
          {
            key: "diamond-lines",
            title: { en: "Every cushion has its own diamond line", nl: "Iedere band heeft een eigen stiplijn" },
            text: {
              en: "A diamond line is the measuring line along one cushion that connects its diamonds. The four cushions therefore have four separate diamond lines. V and A always refer to one of these lines, never to the cushion edge.",
              nl: "Een stiplijn is de meetlijn langs één band die de stippen van die band verbindt. De vier banden hebben dus vier afzonderlijke stiplijnen. V en A verwijzen altijd naar zo'n stiplijn, nooit naar de bandrand."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "running-or-reverse",
            title: { en: "+ running · − reverse", nl: "+ mee · − contra" },
            text: {
              en: "A line starts as + (running). If the ball and therefore the line skip a cushion, the framework changes and the state switches to − (reverse). That state continues until another cushion is skipped. In Track FOUR, Body East–West causes the switch; Cross West–South remains reverse. In Track FIVE, the first switch occurs at Leg West–East.",
              nl: "Een lijn begint op + (mee). Slaan de bal en dus de lijn een band over, dan verandert het Karkas en schakelt de loop naar − (contra). Die stand blijft gelden tot een volgende bandoverslag. Bij VIER veroorzaakt Romp Oost–West de omschakeling; Kruis West–Zuid blijft contra. Bij VIJF gebeurt de eerste omschakeling bij Been West–Oost."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["kruis","been"] }
          },
          {
            key: "rule-direction",
            title: { en: "Rule · Dir", nl: "Regel · Dir" },
            text: {
              en: "Dir records the cushion order. Every A names the next cushion, but the order can differ by track. Track FIVE uses S–W–N–E–S–W–E–N. Track FOUR uses S–W–N–E–W–S–E–N.",
              nl: "Dir noteert de bandvolgorde. Iedere A noemt de volgende band, maar de volgorde kan per spoor verschillen. Spoor VIJF gebruikt S–W–N–O–Z–W–O–N. Spoor VIER gebruikt S–W–N–O–W–Z–O–N."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","kop","nek","romp","kruis","been","hiel"] }
          },
          {
            key: "track-four-body-cross",
            title: { en: "Track FOUR · East to West", nl: "Spoor VIER · Oost naar West" },
            text: {
              en: "In Track FOUR, Body runs directly from East to West. At the same ball on the West cushion, Cross takes over and runs with reverse English toward the South cushion. After Cross, the Run-out follows: Leg + Heel. The configured Cross angle determines the exact South arrival.",
              nl: "In Spoor VIER loopt Romp rechtstreeks van Oost naar West. Op dezelfde bal aan de Westband neemt Kruis over en loopt met contra-effect naar de Zuidband. Na Kruis volgt de Uitloop: Been + Hiel. De geconfigureerde Kruishoek bepaalt de precieze aankomst op Zuid."
            },
            image: { source: "KruinLines", line: "VIER", parts: ["romp","kruis","been","hiel"], tables: ["klein","groot"], focusProfile: "actieveLijn", emphasize: "romp-kruis", loop: "-" }
          },
          {
            key: "rule-reflection",
            title: { en: "Rule · incidence equals reflection", nl: "Regel · hoek van inval is hoek van uitval" },
            text: {
              en: "For every LSL track, Heel is provisionally derived by reflecting Leg at the East cushion: the angle of incidence equals the angle of reflection. Heel remains reverse until a later cushion skip changes the state.",
              nl: "Voor ieder LKL-spoor wordt Hiel voorlopig afgeleid door Been op de Oostband te spiegelen: hoek van inval is hoek van uitval. Hiel blijft contra totdat een latere bandoverslag de stand verandert."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["been","hiel"] }
          },
          {
            key: "rule-bibu",
            title: { en: "Rule · In/Out", nl: "Regel · BiBu" },
            text: {
              en: "In/Out describes the relation between departure and Body arrival. S+1 starts inside and arrives outside on the South cushion; S−1 starts outside and arrives inside.",
              nl: "BiBu beschrijft de relatie tussen start en Romp A. S+1 begint binnen (Bi) en komt op de Zuidband buiten (Bu) aan; S−1 begint buiten en komt binnen aan."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"] }
          },
          {
            key: "rule-small-arrival-row",
            title: { en: "All balls together!", nl: "Alle ballen verzamelen!" },
            text: {
              en: "Choose Parallel (P) and Arrivals. Only the base Body line is shown, with every S−2 through S+2 arrival ball physically against cushion 4 (South). On the Small table they form a row of five exactly adjacent balls. For other lines or tables, the balls may touch, overlap or lie apart.",
              nl: "Kies Parallel (P) en Aankomsten. Je ziet alleen de basisromp met op Romp A alle aankomstballen van S−2 tot en met S+2 werkelijk tegen band 4 (Zuid). Op Klein vormen zij een rij van vijf ballen die precies naast elkaar liggen. Bij andere lijnen of tafels kunnen de ballen naast elkaar liggen, overlappen of uit elkaar liggen."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["romp"], tables: ["klein"], showArrivalSeries: true, offsets: [-2,-1,0,1,2] }
          },
          {
            key: "head-neck-experience-anchors",
            title: { en: "Experience anchors · Head and Neck", nl: "Ervaringsankers · Kop en Nek" },
            text: {
              en: "Small Head A: FOUR N28, FIVE N19, SIX N10. Large Head A / Neck A: FOUR N25 / E10, FIVE N15 / E20, SIX N10 / E30. Head A is also the starting anchor for the shortened four-cushion route.",
              nl: "Klein Kop A: VIER N28, VIJF N19, ZES N10. Groot Kop A / Nek A: VIER N25 / O10, VIJF N15 / O20, ZES N10 / O30. Kop A is ook het uitgangsanker voor de verkorte vierbander."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["kop","nek"], tables: ["groot","klein"] }
          },
          {
            key: "rule-position-to-line",
            title: { en: "Rule · Position to line", nl: "Regel · Positie naar lijn" },
            text: {
              en: "Starting from a known position on the current line, determine which next line must be played. First application: Body A determines Cross, departing at 45 degrees. More position-to-line relations will be added later.",
              nl: "Ga uit van een bekende positie op de huidige lijn en bepaal welke volgende lijn gespeeld moet worden. Eerste toepassing: Romp A bepaalt Kruis, dat onder 45 graden vertrekt. Meer positie-naar-lijnrelaties volgen later."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["romp","kruis"] }
          },
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
              nl: "A is aankomst en V is vertrek. Iedere waarde verwijst naar een stip en de bijbehorende stiplijn. Een stiplijn loopt langs één band en verbindt de stippen van die band; iedere band heeft een eigen stiplijn. De bandrand blijft zichtbaar, maar is nooit de meetlijn."
            },
            image: { source: "KruinLines", line: "VIJF", parts: ["neus","romp"], emphasize: "guides" }
          },
          {
            key: "shift",
            title: { en: "Shift names the next line", nl: "Schuif benoemt de volgende lijn" },
            text: {
              en: "SHIFT moves the complete line setup. FIVE can become SIX, and the same naming extends to ZERO and later lines. The line—not one diamond—is the unit.",
              nl: "SCHUIF verplaatst de volledige spooropzet. Spoor VIJF wordt zo Spoor ZES; dezelfde naamgeving geldt ook voor Spoor NUL en latere sporen. Het spoor—niet één stip of lijnstuk—is de eenheid."
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
      defaultLengthsCm: { klein: { VIJF:83 } },
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
        includes: ["ball"],
        paddingSvg: 0,
        showOutline: true
      },
      valueWindow: {
        outsideWoodGapSvg: 3,
        widthSvg: 100,
        heightSvg: 54,
        cornerRadiusSvg: 9,
        fontSizeSvg: 13
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
      showPointType: true,
      suppressNearestTenInReplacementMode: true
    }
  },
  shotLines: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT","NEGEN","TIEN","ELF","TWAALF"],
  trackRoutes: {
    NUL: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    EEN: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    TWEE: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    DRIE: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    VIER: { startLabel: "S", arrivals: ["west","noord","oost","west","zuid","oost","noord"], rule: "each_arrival_selects_the_next_cushion", note: "body_east_to_west_then_cross_reverse_west_to_south" },
    VIJF: {
      startLabel: "S",
      arrivals: ["west","noord","oost","zuid","west","oost","noord"],
      rule: "each_arrival_selects_the_next_cushion"
    },
    ZES: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    ZEVEN: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" },
    ACHT: { startLabel: "S", arrivals: ["west","noord","oost","zuid","west","oost","noord"], rule: "each_arrival_selects_the_next_cushion" }
  },
  lklTrackRules: {
    appliesTo: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT"],
    panelTracks: ["NUL","EEN","TWEE","DRIE","VIER","VIJF","ZES","ZEVEN","ACHT"],
    noseArrivalByTrack: { NUL:0, EEN:10, TWEE:20, DRIE:30, VIER:40, VIJF:50, ZES:60, ZEVEN:70, ACHT:80 },
    route: ["S","W","N","O","Z","W","O","N"],
    routeByTrack: { VIER:["S","W","N","O","W","Z","O","N"] },
    cross: { defaultAngleDegrees:45, defaultArrivalBand:"west", defaultLoop:"+", configurablePerTableAndTrack:true, rule:"depart_from_body_arrival_and_follow_configured_angle_to_configured_arrival_band" },
    leg: { to:{band:"oost",value:10,fixed:true}, from:{rule:"derive_from_cross_arrival"} },
    heel: { from:{band:"oost",rule:"shared_with_leg_arrival"}, to:{band:"noord",rule:"angle_of_incidence_equals_angle_of_reflection"} },
    experienceAnchors: {
      klein: {
        VIER: { headArrival:{band:"noord",value:28} },
        VIJF: { headArrival:{band:"noord",value:19} },
        ZES: { headArrival:{band:"noord",value:10} }
      },
      groot: {
        VIER: { headArrival:{band:"noord",value:25}, neckArrival:{band:"oost",value:10} },
        VIJF: { headArrival:{band:"noord",value:15}, neckArrival:{band:"oost",value:20} },
        ZES: { headArrival:{band:"noord",value:10}, neckArrival:{band:"oost",value:30} }
      },
      shortenedFourCushion: "use_head_arrival_as_starting_anchor"
    },
    loop: { initial:"+", toggleOnSkippedCushion:true, persistUntilNextSkippedCushion:true }
  },
  trackSpecs: {
    VIJF: {
      complete: true,
      tables: ["klein","groot"],
      loop: {
        default: "+",
        defaultMeaning: "mee",
        skippedCushion: "-",
        skippedCushionMeaning: "contra",
        rule: "use_contra_when_from_and_to_skip_an_intermediate_cushion"
      },
      parts: {
        neus: {
          fixed: true,
          from: { kind: "acquit", value: "S" },
          to: { band: "west", value: 50 }
        },
        romp: {
          source: "Kruin",
          defaultByTable: {
            klein: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 38 } },
            groot: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 36 } }
          }
        },
        kruis: {
          defaultAngleDegrees: 45,
          configurablePerTableAndTrack: true,
          rule: "derive_from_body_arrival"
        },
        been: {
          to: { band: "oost", value: 10, fixed: true },
          from: { band: "west", rule: "derive_from_cross_arrival" },
          loop: "-"
        },
        hiel: {
          from: { band: "oost", rule: "shared_with_leg_arrival" },
          to: { band: "noord", rule: "angle_of_incidence_equals_angle_of_reflection" },
          loop: "-"
        }
      }
    }
  },
  rules: {
    Dir: {
      labels: { en: "Direction", nl: "Richting" },
      rule: "each_arrival_names_the_next_cushion",
      five: ["S","W","N","O","Z","W","O","N"]
    },
    Loop: {
      labels: { en: "Running / reverse", nl: "Mee / contra" },
      initial: "+",
      toggleOnSkippedCushion: true,
      persistUntilNextSkippedCushion: true,
      skippedCushionPairs: [["west","oost"],["oost","west"],["noord","zuid"],["zuid","noord"]],
      skeletonConsequence: "a_skipped_cushion_changes_the_framework_and_switches_running_reverse_state",
      note: "Track FOUR Body east_to_west switches to reverse; Cross west_to_south inherits reverse"
    },
    Reflection: {
      labels: { en: "Angle of incidence equals angle of reflection", nl: "Hoek van inval is hoek van uitval" },
      appliesTo: ["hiel"],
      status: "provisional"
    },
    PositionToLine: {
      labels: { en: "Position to line", nl: "Positie naar lijn" },
      rule: "a_known_position_on_the_current_line_determines_the_next_line_to_play",
      applications: [
        { from:{part:"romp",point:"A"}, to:{part:"kruis",departureAngleSource:"Kruinconfig.crossAngleDeg",defaultDegrees:45} }
      ],
      status: "extend_in_explanation_later"
    },
    BiBu: {
      labels: { en: "In/Out", nl: "BiBu" },
      relation: "opposite_sides",
      plus: { departure:"inside", bodyArrival:"outside", southDiamondDirection:"minus" },
      minus: { departure:"outside", bodyArrival:"inside", southDiamondDirection:"plus" }
    },
    SmallLklArrivalRow: {
      table: "klein",
      departureOffsets: [-2,-1,0,1,2],
      arrivalBand: "zuid",
      appearance: "adjacent_ball_row"
    }
  },
  lineOneVariants: {
    defaultMode: "basis",
    modes: ["basis", "parallel", "waaier"],
    parallel: {
      minimumOffset: -2,
      maximumOffset: 8,
      defaultOffset: 0,
      longRailUnitsPerStep: 10,
      startLabel: "S",
      startAxis: "vertical_centerline",
      arrivalConstraint: { band:"west", minimum:0, maximum:80 },
      bodyArrivalByTable: {
        klein: { band:"zuid", ballWidthsPerStep:1, ballDiameterCm:6.15, diamondUnitsPerStep:6.15/115*40, offsetSign:-1 },
        groot: { band:"zuid", ballWidthsPerStep:1.5, ballDiameterCm:6.15, diamondUnitsPerStep:1.5*6.15/142*40, offsetSign:-1 }
      },
      backwardFromBodyArrival: {
        parts: ["romp","nek","kop"],
        rule: "keep_each_part_parallel_to_its_base_track"
      },
      rule: "BiBu: plus_start_inside_body_A_outside_so_south_value_decreases; minus_is_inverse; then_body_neck_head_recalculate_backward"
    },
    fan: {
      rule: "every_known_value_is_midpoint_of_adjacent_tracks",
      entries: [
        { key:"HALFEEN", between:["NUL","EEN"], noseArrival:5, fraction:0.5 },
        { key:"HALFTWEE", between:["EEN","TWEE"], noseArrival:15, fraction:0.5 },
        { key:"HALFDRIE", between:["TWEE","DRIE"], noseArrival:25, fraction:0.5 },
        { key:"HALFVIER", between:["DRIE","VIER"], noseArrival:35, fraction:0.5 },
        { key:"HALFVIJF", between:["VIER","VIJF"], noseArrival:45, fraction:0.5 },
        { key:"HALFZES", between:["VIJF","ZES"], noseArrival:55, fraction:0.5 },
        { key:"HALFZEVEN", between:["ZES","ZEVEN"], noseArrival:65, fraction:0.5 },
        { key:"HALFACHT", between:["ZEVEN","ACHT"], noseArrival:75, fraction:0.5 }
      ]
    }
  },
  patternByLine: { NUL:"LKL", EEN:"LKL", TWEE:"LKL", DRIE:"LKL", VIER:"LKL", VIJF:"LKL", ZES:"LKL", ZEVEN:"LKL", ACHT:"LKL" },
  patternLabels: {
    NUL:{en:"ZERO",nl:"NUL"}, EEN:{en:"ONE",nl:"EEN"}, TWEE:{en:"TWO",nl:"TWEE"}, DRIE:{en:"THREE",nl:"DRIE"}, VIER:{en:"FOUR",nl:"VIER"},
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
    neus:{from:"V",to:"west"}, kop:{from:"west",to:"noord"},
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
    restrictionsEnabled:false,
    wrap:true,
    integerStep:1,
    overrides:{}
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
    klein:{
    VIER:{romp:{from:{band:"oost",value:5},to:{band:"zuid",value:70}}},
    VIJF:{
      neus:{from:{kind:"acquit",value:"S"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:35,status:"calculated"},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:13,status:"calculated"},to:{band:"oost",value:32,status:"calculated"}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}},
      kruis:{from:{band:"zuid",value:31,status:"calculated"},to:{band:"west",value:10}},
      been:{from:{band:"west",value:null,status:"calculated"},to:{band:"oost",value:10,status:"approved"}}
    },
    ZES:{romp:{from:{band:"oost",value:30},to:{band:"zuid",value:30}}},
    ZEVEN:{romp:{from:{band:"oost",value:35},to:{band:"zuid",value:20}}},
    ACHT:{romp:{from:{band:"oost",value:43},to:{band:"zuid",value:19}}}
    },
    groot:{
    VIJF:{
      neus:{from:{kind:"acquit",value:"S"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:null,status:"calculated"},to:{band:"noord",value:15,status:"approved"}},
      nek:{from:{band:"noord",value:null,status:"calculated"},to:{band:"oost",value:20,status:"approved"}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:36}},
      been:{from:{band:"west",value:null,status:"calculated"},to:{band:"oost",value:10,status:"approved"}}
    },
    ZES:{romp:{from:{band:"oost",value:30},to:{band:"zuid",value:28}}},
    ZEVEN:{romp:{from:{band:"oost",value:37},to:{band:"zuid",value:22}}},
    ACHT:{romp:{from:{band:"oost",value:48},to:{band:"zuid",value:18}}}
    }
  }
};

return {id:"kruin-v174-76ffd6f08585a280242c",label:"Kruin v174 · Kruinconfig",config:window.THREEB_START_CONFIG,values:{"onscreenMenu":{"groups":{"edit":{"order":20,"visible":true,"zone":"bottom"},"menuPanel":{"order":30,"visible":true,"zone":"bottom"},"menuToggle":{"order":10,"visible":true,"zone":"bottom"},"next":{"order":10,"visible":true,"zone":"right"},"previous":{"order":10,"visible":true,"zone":"left"},"track":{"order":10,"visible":true,"zone":"top"}},"safeGapPx":10,"zones":["top","left","right","bottom"]},"release":174,"savedSpoorValues":[],"source":"Kruinconfig-3B-v174.ods","tracks":{"groot":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":18},"rompV":{"band":"oost","value":48}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":20.599},"rompV":{"band":"oost","value":44}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.197},"rompV":{"band":"oost","value":39}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":20},"rompV":{"band":"oost","value":42.5}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":15},"neusA":{"band":"west","value":45}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12.5},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":32},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":33.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":40}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":15},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":36},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":6},"nekA":{"band":"oost","value":32},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":33.401},"rompV":{"band":"oost","value":24}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":36},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":30.803},"rompV":{"band":"oost","value":28}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":41},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":28.204},"rompV":{"band":"oost","value":33}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":24},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":38.599},"rompV":{"band":"oost","value":16}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":41.197},"rompV":{"band":"oost","value":12}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":28},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":43},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":25.401},"rompV":{"band":"oost","value":34}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":48},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":22.803},"rompV":{"band":"oost","value":39}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":30.599},"rompV":{"band":"oost","value":26}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":33.197},"rompV":{"band":"oost","value":21}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":22},"rompV":{"band":"oost","value":37}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19.401},"rompV":{"band":"oost","value":42}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":24.599},"rompV":{"band":"oost","value":32}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":27.197},"rompV":{"band":"oost","value":27}}},"klein":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":2},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19},"rompV":{"band":"oost","value":43}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":21.14},"rompV":{"band":"oost","value":39}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.278},"rompV":{"band":"oost","value":35}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":19.5},"rompV":{"band":"oost","value":39}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":23.5},"neusA":{"band":"west","value":45},"rompA":{"band":"zuid","value":54},"rompV":{"band":"oost","value":12.5}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":14.5},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":34},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":32.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":28},"neusA":{"band":"west","value":40},"rompA":{"band":"west","value":10},"rompV":{"band":"oost","value":10}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":14},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":67.861},"rompV":{"band":"oost","value":7}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":17},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":65.722},"rompV":{"band":"oost","value":10}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":19},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":63.583},"rompV":{"band":"oost","value":12}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":32},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":72.14},"rompV":{"band":"oost","value":3}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":36},"nekA":{"band":"oost","value":7},"neusA":{"band":"west","value":20},"rompA":{"band":"zuid","value":74.278},"rompV":{"band":"oost","value":0}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":19},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":38},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":35.861},"rompV":{"band":"oost","value":23}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":13},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":33.722},"rompV":{"band":"oost","value":27}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":42},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":31.583},"rompV":{"band":"oost","value":30}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":22},"nekA":{"band":"oost","value":29},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":40.14},"rompV":{"band":"oost","value":17}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":42.278},"rompV":{"band":"oost","value":13}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":30},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":7},"nekA":{"band":"oost","value":45},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":27.861},"rompV":{"band":"oost","value":33}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":49},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":25.722},"rompV":{"band":"oost","value":37}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":32.14},"rompV":{"band":"oost","value":27}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":34.278},"rompV":{"band":"oost","value":23}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":23},"rompV":{"band":"oost","value":35}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":17.861},"rompV":{"band":"oost","value":39}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":22.14},"rompV":{"band":"oost","value":31}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":24.278},"rompV":{"band":"oost","value":26}}}}}};})());
window.THREEB_DEFAULT_BASIS="kruin-v174-76ffd6f08585a280242c";
