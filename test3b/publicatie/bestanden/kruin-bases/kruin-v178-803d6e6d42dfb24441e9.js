globalThis.THREEB_BASES.push((()=>{const window={};
window.THREEB_START_CONFIG = {
  version: 101, release: "178", publicRelease: "178",
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
  "version": "1.1",
  "glossary": {
  "neus": {
    "title": {
      "nl": "Neus",
      "en": "Nose"
    },
    "text": {
      "nl": "De eerste lijn: van startpositie S naar het aankomstpunt op de eerste stiplijn. Bij basis-VIJF richt je naar West 50. In deze oefening verander je alleen de afstootlengte.",
      "en": "The first line runs from starting position S towards the arrival point on the first diamond line. Base FIVE aims at West 50. This exercise changes only stroke length."
    }
  },
  "stiplijn": {
    "title": {
      "nl": "Stiplijn",
      "en": "Diamond line"
    },
    "text": {
      "nl": "De meetlijn die de stippen langs één band verbindt. Iedere band heeft een eigen stiplijn. V en A liggen op deze meetlijnen; het raakpunt van de bal ligt op de bandrand.",
      "en": "The measuring line connecting the diamonds along one cushion. Each cushion has its own diamond line. V and A lie on these lines; the ball contacts the cushion edge."
    }
  },
  "karkas": {
    "title": {
      "nl": "Karkas",
      "en": "Framework"
    },
    "text": {
      "nl": "Neus en Romp vormen samen het Karkas van dit spoor. Zoek eerst de doelbal op de Romp en daarna de speelbal op de Neus. Kop en Nek verbinden deze twee lijnen zodra Kop A bekend is.",
      "en": "Nose and Body form the framework of this track. Find the target ball on the Body first, then the cue ball on the Nose. Head and Neck connect these lines once Head A is known."
    }
  },
  "kop": {
    "title": {
      "nl": "Kop",
      "en": "Head"
    },
    "text": {
      "nl": "De lijn na de Neus. Bij basis-VIJF loopt hij van West naar Noord. Kop A meet je bij voorkeur met ijkjes. Kruin mat op zijn tafels Klein 19 en Groot 15. Bekende Neus en Romp bepalen Kop A niet eenduidig; een gekozen geometrische schatting blijft een benadering.",
      "en": "The line after the Nose, from West to North in base FIVE. Prefer measuring Head A with markers. Kruin measured Small 19 and Large 15 on his tables. Known Nose and Body do not uniquely determine Head A; an explicitly chosen geometric estimate remains approximate."
    }
  },
  "nek": {
    "title": {
      "nl": "Nek",
      "en": "Neck"
    },
    "text": {
      "nl": "De lijn van de gedeelde Noordbal naar Oost. De app construeert de bal op Noord met de Koplijn en Kop A. Hij verlengt de uitgaande Neklijn terug naar de Noord-stiplijn: daar ligt Nek V. Kop A en Nek V kunnen verschillende stipwaarden hebben, hoewel de balpositie dezelfde is.",
      "en": "The line from the shared North ball to East. The app constructs the North ball from the Head line and Head A, then extends the outgoing Neck back to the North diamond line to locate Neck V. Head A and Neck V can differ despite sharing one ball position."
    }
  },
  "romp": {
    "title": {
      "nl": "Romp",
      "en": "Body"
    },
    "text": {
      "nl": "De lijn waarop je in Les 1 de doelbal zoekt. Bij VIJF loopt Romp van Oost naar Zuid. Romp V blijft in de oefening vast; je noteert je eigen Romp A. Een referentiewaarde wordt daardoor geen eigen meting.",
      "en": "The line on which you find the target ball in Lesson 1. In FIVE it runs from East to South. Body V stays fixed in this exercise while you record your own Body A. A reference value is not thereby your own measurement."
    }
  },
  "v": {
    "title": {
      "nl": "V · vertrek",
      "en": "V · departure"
    },
    "text": {
      "nl": "V is het vertrekpunt van een lijn op een stiplijn. Verleng de uitgaande lijn terug naar die stiplijn om V te vinden. De aankomst van de vorige lijn en dit vertrek delen één fysieke bandbal; hun stiplijnwaarden hoeven niet gelijk te zijn.",
      "en": "V is the departure point of a line on a diamond line. Extend the outgoing line back to locate V. The previous arrival and this departure share one physical cushion ball; their diamond values need not match."
    }
  },
  "a": {
    "title": {
      "nl": "A · aankomst",
      "en": "A · arrival"
    },
    "text": {
      "nl": "A is het aankomstpunt van een lijn op een stiplijn: verleng de lijn in de looprichting. Het is niet het raakpunt op de bandrand. Bij de volgende lijn bepaalt dezelfde bandbal het vertrek, met een eigen V-punt op de stiplijn.",
      "en": "A is the arrival point on a diamond line, found by extending the line in its direction of travel. It is not the contact point on the cushion edge. The same cushion ball determines the next departure with its own V point."
    }
  },
  "s": {
    "title": {
      "nl": "S · start",
      "en": "S · start"
    },
    "text": {
      "nl": "S is de startpositie van de speelbal op de Neus. Noteer deze positie zodat je de stoot kunt herhalen. S is geen aankomstpunt op een band.",
      "en": "S is the cue ball starting position on the Nose. Record it so you can repeat the stroke. It is not a cushion arrival point."
    }
  },
  "ijkjes": {
    "title": {
      "nl": "Ijkjes",
      "en": "Markers"
    },
    "text": {
      "nl": "Lichte markeringen maken een passage langs de band zichtbaar. Een omgevallen ijkje toont de raakzone. Bepaal vervolgens de lijnrichting en het punt op de stiplijn; de raakzone zelf heeft geen stiplijnwaarde.",
      "en": "Light markers reveal a passage along the cushion. A fallen marker indicates the contact zone. Then determine the line direction and its diamond-line point; the contact zone itself is not a diamond value."
    }
  },
  "spoor": {
    "title": {
      "nl": "Spoor",
      "en": "Track"
    },
    "text": {
      "nl": "Het volledige verloop, bijvoorbeeld VIJF of VIJF+1. Neus, Kop, Nek en Romp zijn afzonderlijke lijnen binnen dat spoor.",
      "en": "The complete route, such as FIVE or FIVE+1. Nose, Head, Neck and Body are individual lines within it."
    }
  },
  "herkomst": {
    "title": {
      "nl": "Herkomst",
      "en": "Origin"
    },
    "text": {
      "nl": "Oker: configuratie / Karkas. Groen: Kruinwaarde, Kruinmeting of eigen meting; het tekstlabel onderscheidt ze. Rood: berekend, bij benadering berekend of berekend uit schatting. Blauw: ge-edit. Gebruik kleur én tekst om de getoonde waarde te beoordelen.",
      "en": "Ochre: configuration / framework. Green: Kruin value, Kruin measurement or own measurement, distinguished by text. Red: calculated, approximately calculated or calculated from estimate. Blue: edited. Use both colour and text to assess each value."
    }
  }
},
  "defaultLevel": "LKL",
  "scopeRules": {
    "systemExplanation": "shared_large_and_small",
    "lineExplanation": "one_line_one_table",
    "requiredLineFields": [
      "line",
      "table",
      "snapshot"
    ]
  },
  "levels": [
    {
      "key": "LKL",
      "order": 1,
      "tables": [
        "groot",
        "klein"
      ],
      "labels": {
        "nl": "Les 1 · mijn eigen VIJF",
        "en": "Lesson 1 · my own FIVE"
      },
      "description": {
        "nl": "Mijn eigen VIJF spelen, herhalen en als volledige Romplijn vastleggen.",
        "en": "Play and repeat my own FIVE, recording the complete Body line."
      },
      "slides": [
        {
          "key": "lesson-five-goal",
          "title": {
            "nl": "De tafel · uitleg en aanleg",
            "en": "The table · explanation and setup"
          },
          "text": {
            "nl": "Deze tafel heeft twee functies. Uitleg: volg de voortgaande bal en begrijp wat je ziet, meet of berekent. Aanleg: stel jouw tafel in met die waarden en bewaar ze. Het Karkas is in beide leidend: eerst Neus en Romp. Daarna verbinden Kop en Nek die lijnen. Bij elke waarde staat de herkomst. Gebruik de pijlen voor uitleg; kies Aanleg om je eigen tafel in te stellen. Onderstreepte begrippen geven korte uitleg; je blijft op dezelfde leskaart. Speel op de echte tafel, kijk en stel bij.",
            "en": "This table has two functions. Explanation: follow the moving ball and understand what you see, measure or calculate. Setup: configure and save your own table with those values. The framework leads both: establish Nose and Body first, then connect them with Head and Neck. Every value states its origin. Use the arrows for explanation; choose Setup to configure your own table. Underlined terms open short explanations while keeping your lesson position. Play on the real table, observe and adjust."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          }
        },
        {
          "key": "lesson-framework",
          "title": {
            "nl": "Het Karkas · eerst Romp, dan Neus",
            "en": "The framework · Body first, then Nose"
          },
          "text": {
            "nl": "Het Karkas is leidend: Neus en Romp. Zoek eerst de doelbal op de Romp, daarna de speelbal op de Neus. Leg deze twee lijnen vast. Kop en Nek verbinden vervolgens het Karkas; daarvoor gebruiken we gemeten Kop A en berekenen we daarna Nek V. Zonder eigen meting kun je Kop A bij benadering laten berekenen. V en A zijn punten op de stiplijnen. Bij de Romp van VIJF: V op Oost → A op Zuid. Raakpunten liggen op de banden. S is de startpositie van de speelbal. Uitleg laat zien hoe dit samenhangt; bij Aanleg leg je de waarden voor jouw tafel vast.",
            "en": "The framework leads: Nose and Body. Find the target ball on the Body, then the cue ball on the Nose. Establish these two lines first. Head and Neck then connect the framework: measure Head A before calculating Neck V. V and A are diamond-line points. For the Body of FIVE: V on East → A on South. Contact points lie on cushions. S is the cue ball starting position."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          }
        },
        {
          "key": "lesson-target-on-line",
          "title": {
            "nl": "1 · ligt bal 2 op de Romp?",
            "en": "1 · is ball 2 on the Body line?"
          },
          "text": {
            "nl": "Kijk eerst naar de rode doelbal (bal 2). Volg de getoonde Romplijn. Ligt het middelpunt van bal 2 op die lijn? Kies je antwoord en bekijk de uitleg. In latere lessen vergelijken we meerdere sporen.",
            "en": "First look at the red target ball (ball 2). Follow the Body line. Is the centre of ball 2 on that line? Choose an answer and read the explanation. Later lessons compare several tracks."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true,
            "targetBall": {
              "number": 2,
              "position": {
                "kind": "lineFraction",
                "line": "romp",
                "fraction": 0.55
              }
            }
          },
          "exercise": {
            "type": "target-on-line",
            "correct": "yes"
          }
        },
        {
          "key": "lesson-cue-start",
          "title": {
            "nl": "2 · zien · S en Aneus",
            "en": "2 · see · S and Nose A"
          },
          "text": {
            "nl": "Je ziet de Neus vanaf je speelplek. Noteer S: de vaste startpositie voor deze oefening. Noteer Aneus: bij de basis-VIJF 50 op de West-stiplijn. Je richt naar dat stiplijnpunt; noteer niet het raakpunt op de band. De speelbal ligt met zijn middelpunt op de Neus. Naar de Neus stelt alleen de afstootlengte in.",
            "en": "You can see the Nose from your playing position. Record S, the fixed starting position for this exercise, and Nose A: 50 on the West diamond line for the base FIVE. Aim at that diamond-line point; do not record the cushion contact point. Open Nose changes only the stroke length."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "action": "nose"
        },
        {
          "key": "lesson-roll-at-first",
          "title": {
            "nl": "3 · ga kijken · ijkjes op Oost",
            "en": "3 · observe · markers on East"
          },
          "text": {
            "nl": "Speel langs de Neus en laat de bal rollend aankomen op band 1. Plaats voor een volgende poging lichte ijkjes op de rand van de Oostband. Kijk welk ijkje omvalt. Dat maakt de raakzone zichtbaar. Volg daarna de voortgaande bal naar Zuid: naar welke stipwaarde op de Zuid-stiplijn loopt de Romp? De ijkjes in het lesbeeld zijn schematisch; ze krijgen geen stipwaarde op de bandrand.",
            "en": "Play along the Nose, reaching cushion 1 rolling. Before another attempt, place light markers on the edge of the East cushion. Observe which marker falls. This reveals the contact zone. Then follow the outgoing ball towards the South diamond line. The pictured markers are schematic and have no diamond values on the cushion edge."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "romp"
            ],
            "courseTable": true,
            "measurement": "east-body",
            "emphasize": "guides"
          },
          "action": "table"
        },
        {
          "key": "lesson-record-body",
          "title": {
            "nl": "4 · noteer de voortgaande Romplijn",
            "en": "4 · record the outgoing Body line"
          },
          "text": {
            "nl": "V en A zijn stiplijnpunten: Romp V op Oost en Romp A op Zuid. Noteer de voortgaande lijn V → A. De ene getoonde bal raakt Oost; zijn middelpunt ligt op die lijn. Het raakpunt ligt aan de zijkant van de bal, niet op de stiplijn. Het omgevallen ijkje toont de raakzone. Volg ook de uitgaande richting om V en A op de stiplijnen te bepalen. In deze oefening blijft de getoonde V vast en noteer je A.",
            "en": "V and A are diamond-line points: Body V on East and Body A on South. Record the outgoing line V → A. The single pictured ball touches East and its centre lies on that line. Contact occurs at its side, not on the diamond line. A fallen marker reveals the contact zone; also follow the outgoing direction to locate V and A on the diamond lines. In this exercise V remains fixed and you record A."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "romp"
            ],
            "courseTable": true,
            "emphasize": "guides",
            "measurement": "east-body"
          },
          "practice": "record",
          "action": "body"
        },
        {
          "key": "lesson-repeat-body",
          "title": {
            "nl": "5 · herhaal, kijk en vergelijk",
            "en": "5 · repeat, observe and compare"
          },
          "text": {
            "nl": "Speel drie pogingen vanuit dezelfde S en met zo gelijk mogelijke afstoot. Kijk telkens welk ijkje op Oost omvalt en volg de uitgaande richting naar de Zuid-stiplijn. Noteer per poging Romp A vanuit dezelfde Romp V. Vergelijk de hele lijnen. Wijkt het gemeten vertrek af van de vaste referentie, noteer dat apart; maak van de referentie geen gemeten feit.",
            "en": "Play three attempts from the same S with a consistent stroke. Observe the fallen East marker and the outgoing direction towards the South diamond line. Record Body A from the same reference V. If the observed departure differs from that reference, make a separate note; the reference is not a measurement."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "romp"
            ],
            "courseTable": true,
            "measurement": "east-body",
            "emphasize": "guides"
          },
          "practice": "repeat"
        },
        {
          "key": "lesson-head-measure",
          "title": {
            "nl": "6 · Kop A · meten of benaderen",
            "en": "6 · Head A · measure or approximate"
          },
          "text": {
            "nl": "Het Karkas blijft leidend. Kop A op Noord meet je bij voorkeur met ijkjes; je ziet deze passage niet betrouwbaar vanaf je speelplek. Kruin mat VIJF: Klein 19, Groot 15. Vul je eigen stiplijnwaarde in. Zonder eigen meetgegevens kun je kiezen voor een benadering: de app schat Kop A met spiegeling van de bekende Neus (inval = uitval). Dat is een geometrisch uitgangspunt; laken en afstoot kunnen afwijken. Gemeten en geschat blijven herkenbaar.",
            "en": "The framework leads. Prefer measuring Head A at North with markers; you cannot reliably observe this passage from your playing position. Kruin measured FIVE: Small 19, Large 15. Enter your own diamond-line value. Without measurements you may choose an approximation: the app estimates Head A by reflecting the known Nose (equal incidence and reflection angles). This is a geometric starting point; cloth and stroke may differ. Measurements and estimates stay distinct."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "kop"
            ],
            "courseTable": true,
            "emphasize": "guides"
          },
          "action": "head"
        },
        {
          "key": "lesson-neck-departure",
          "title": {
            "nl": "7 · daarna berekenen we Nek V",
            "en": "7 · then calculate Neck V"
          },
          "text": {
            "nl": "1. De bekende Neus bepaalt de balpositie op West. 2. Met gemeten Kop A (of de gekozen benadering) construeren we de Koplijn en de bal op Noord. 3. De Neklijn vertrekt vanuit diezelfde bal naar Nek A op Oost. Nek A is een meetgegeven of wordt afgeleid uit de gemeten Romp. 4. Verleng de uitgaande Neklijn terug naar de Noord-stiplijn: daar ligt de berekende Nek V. Kop A en Nek V liggen beide op de Noord-stiplijn. Hun waarden hoeven niet gelijk te zijn: de richtingen verschillen. Er is één gedeelde bal op Noord.",
            "en": "1. The known Nose determines the ball position at West. 2. Measured Head A (or the chosen approximation) defines the Head line and the ball at North. 3. The Neck leaves that same ball towards Neck A at East. Neck A is measured or derived from the measured Body. 4. Extend the outgoing Neck back to the North diamond line to obtain calculated Neck V. Head A and Neck V are both North diamond-line points, but need not have equal values because the directions differ. They share one ball at North."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "kop",
              "nek",
              "romp"
            ],
            "courseTable": true,
            "emphasize": "guides",
            "bridgeValues": true
          }
        },
        {
          "key": "lesson-five-finish",
          "title": {
            "nl": "8 · wat kan ik nu zien en meten?",
            "en": "8 · what can I see and measure?"
          },
          "text": {
            "nl": "Ik kan S en Aneus op de stiplijn aanwijzen, een passage op Oost met ijkjes zichtbaar maken en de voortgaande Romplijn naar de Zuid-stiplijn volgen. Ik onderscheid een raakplek op de band van een stipwaarde. Controleer je drie notities en bevestig of je dit kunt. Bewaar Les 1; download via Mijn tafel om je notities mee te nemen. Kop A meet ik bij voorkeur; zonder meetgegevens kan ik een benadering kiezen; Nek V wordt daarna berekend. De Kruinmetingen zijn referenties voor de Kruintafels.",
            "en": "I can identify S and Nose A on the diamond line, reveal the East passage with markers, and follow the outgoing Body line towards the South diamond line. I distinguish cushion contact from a diamond-line value. Review your notes and confirm whether you can do this. Save Lesson 1."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "practice": "finish"
        },
        {
          "key": "parallel-first-goal",
          "title": {
            "nl": "Les 2 · VIJF+1",
            "en": "Lesson 2 · FIVE+1"
          },
          "text": {
            "nl": "Je kent nu je eigen VIJF. Doe er eens eentje bij: VIJF+1. In Parallel (P) verschuift het spoor evenwijdig. Het dunne spoor blijft VIJF; het dikke spoor is de gekozen stand. De tekening helpt je vergelijken. Je eigen stoot mag daarvan afwijken.",
            "en": "You now know your own FIVE. Try one more: FIVE+1. Parallel (P) shifts the track in parallel. The thin track remains FIVE; the thick track is the selected position. Use the diagram to compare. Your own stroke may follow a different route."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "track": "VIJF+1",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          }
        },
        {
          "key": "parallel-plus-one",
          "title": {
            "nl": "1 · wat verandert bij VIJF+1?",
            "en": "1 · what changes with FIVE+1?"
          },
          "text": {
            "nl": "Kijk naar de dunne Neus van VIJF en de dikke Neus van VIJF+1. De richting blijft gelijk. Start en aankomst op band 1 schuiven samen één stap op. Vergelijk daarna de Romplijnen. Kies Toon VIJF+1 op mijn tafel om zelf te kijken.",
            "en": "Compare the thin Nose of FIVE with the thick Nose of FIVE+1. The direction stays the same. The start and arrival on cushion 1 shift together by one step. Then compare the Body lines. Choose Show FIVE+1 on my table to explore."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "track": "VIJF+1",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "action": "parallel-plus"
        },
        {
          "key": "parallel-minus-one",
          "title": {
            "nl": "2 · vergelijk met VIJF−1",
            "en": "2 · compare FIVE−1"
          },
          "text": {
            "nl": "VIJF−1 schuift één stap in de andere richting. VIJF blijft de referentie. Kijk eerst naar de startpositie, daarna naar de Romp. +1 en −1 benoemen de gekozen parallelstand; het zijn geen aanwijzingen voor meer of minder effect.",
            "en": "FIVE−1 shifts one step in the other direction. FIVE remains the reference. Look first at the start, then the Body. +1 and −1 name the parallel position; they do not instruct you to use more or less English."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "track": "VIJF-1",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "action": "parallel-minus"
        },
        {
          "key": "parallel-body-question",
          "title": {
            "nl": "3 · waar komt de Romp aan?",
            "en": "3 · where does the Body arrive?"
          },
          "text": {
            "nl": "Bij de standaard VIJF-Parallel schuift de aankomst van VIJF+1 op Zuid naar een lagere stipwaarde dan de basis. Bekijk de twee lijnen en kies je antwoord. De afstand hangt samen met Groot of Klein en de gekozen Kruinbasis.",
            "en": "In standard FIVE Parallel, FIVE+1 arrives at a lower South diamond-line value than the base track. Compare the two lines and choose your answer. The distance depends on Large or Small and the selected Kruin basis."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "track": "VIJF+1",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "exercise": {
            "type": "parallel-arrival",
            "correct": "lower"
          }
        },
        {
          "key": "parallel-try",
          "title": {
            "nl": "4 · speel en vergelijk",
            "en": "4 · play and compare"
          },
          "text": {
            "nl": "Speel VIJF, VIJF+1 en VIJF−1 op je echte tafel. Houd je afstoot zo gelijk mogelijk. Vergelijk je werkelijk gespeelde Romplijnen met de app. Noteer eigen afwijkingen op de gekozen parallelstand. De app geeft de geometrische referentie; je waarneming bepaalt je eigen tafelwaarden.",
            "en": "Play FIVE, FIVE+1 and FIVE−1 on your real table. Keep your stroke consistent. Compare your actual Body lines with the app. Record your own differences on the selected parallel track. The app supplies the geometric reference; your observations determine your own table values."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "track": "VIJF+1",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "action": "parallel-plus"
        },
        {
          "key": "parallel-next",
          "title": {
            "nl": "5 · eerst Parallel, daarna Waaier",
            "en": "5 · Parallel first, then Fan"
          },
          "text": {
            "nl": "Ik kan VIJF, VIJF+1 en VIJF−1 herkennen en vergelijken. Ga nogmaals naar je oefentafel of bekijk de verdieping. Waaier en HALF-standen behandelen andere richtingen; die volgen na deze parallelstanden.",
            "en": "I can recognise and compare FIVE, FIVE+1 and FIVE−1. Return to the practice table or explore further. Fan and HALF positions use other directions and follow these parallel positions."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "track": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "courseTable": true
          },
          "action": "explore"
        },
        {
          "key": "route-names-three-minus-plus",
          "title": {
            "en": "The complete route",
            "nl": "De volledige balbaan"
          },
          "text": {
            "en": "The route is named Nose, Head, Neck, Body, Cross, Leg, Heel, Foot and Toe. Leg could also have been called Tail. In this course, Leg and Heel together are called the Run-out. Nose, Head and Neck introduce the run-up below three cushions. Route choices for the target ball start at Body: three cushions or more.",
            "nl": "De balbaan heet Neus, Kop, Nek, Romp, Kruis, Been, Hiel, Voet en Teen. Been had ook Staart mogen heten. In de cursus heten Been en Hiel samen de Uitloop. Neus, Kop en Nek introduceren de aanloop onder drie banden. De routekeuze voor de doelbal begint bij Romp: drie banden of meer."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "kop",
              "nek",
              "romp",
              "kruis",
              "been",
              "hiel",
              "voet",
              "teen"
            ],
            "tables": [
              "klein"
            ]
          }
        },
        {
          "key": "nose-reference-and-user",
          "title": {
            "nl": "De vaste Neus en mijn startpositie",
            "en": "The fixed Nose and my start position"
          },
          "text": {
            "nl": "De Kruinbasis geeft de Neus als referentielijn. In de Neuseditor verandert alleen de afstootlengte: daarmee plaats je de speelbal langs de vaste lijn. Vergelijk je eigen Romplijn met de referentie door herhaalde pogingen te noteren.",
            "en": "The Kruin basis supplies the reference Nose line. The Nose editor changes only the stroke length, placing the cue ball along the fixed line. Compare your own Body line with the reference by recording repeated attempts."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus"
            ],
            "tables": [
              "klein"
            ]
          }
        },
        {
          "key": "find-target-track",
          "title": {
            "en": "1 · Which track is my target ball on?",
            "nl": "1 · Op welk spoor ligt mijn doelbal?"
          },
          "text": {
            "en": "First look only at ball 2: which 3+ route is it on? Only Body (3 cushions) and the later route parts are offered. More than one track may fit. Choose one or more candidates and compare them.",
            "nl": "Kijk eerst alleen naar bal 2: op welke 3+-route ligt mijn doelbal? Alleen Romp (3 banden) en de volgende delen worden aangeboden. Er kunnen meerdere sporen passen. Kies één of meer kandidaten en vergelijk ze."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "tables": [
              "klein"
            ],
            "focusProfile": "les1",
            "targetBall": {
              "number": 2,
              "position": {
                "kind": "parallelStart",
                "baseTrack": "VIJF",
                "offset": -1
              }
            },
            "allowMultipleTracks": true
          }
        },
        {
          "key": "body-user-as-is",
          "title": {
            "en": "Track FIVE · your own stroke",
            "nl": "Spoor VIJF · je eigen afstoot"
          },
          "text": {
            "en": "Use the Kruin image of Nose + Body. Play the Nose with your own current delivery and record the Body's arrival line in the app. Further instructions on assessing that arrival line will follow later.",
            "nl": "Gebruik het Kruinbeeld van Neus + Romp. Stoot de Neus af met je huidige eigen afstoot en noteer in de app de aankomstlijn van de Romp. Verdere instructie over het beoordelen van die aankomstlijn volgt later."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "focusProfile": "les1",
            "role": "user-as-is",
            "recordBodyArrivalLine": true
          }
        },
        {
          "key": "body-kruin-reference",
          "title": {
            "nl": "Verdieping · de Kruinafstoot",
            "en": "Further study · the Kruin stroke"
          },
          "text": {
            "nl": "De Kruinreferentie gebruikt een specifieke afstoot met maximaal effect en een middenhoge raakplaats. Dat vraagt aparte instructie aan de echte tafel. In Les 1 leg je eerst je eigen afstoot en Romplijn vast. De referentiewaarden hangen samen met de gekozen Kruinbasis.",
            "en": "The Kruin reference uses a specific stroke with maximum English and a mid-high contact point. This requires separate instruction at the real table. In Lesson 1, first record your own stroke and Body line. The reference values belong to the selected Kruin basis."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "focusProfile": "les1",
            "role": "kruin-reference",
            "effect": "maximum",
            "contactTangent": "mid-high",
            "showShadowLine": true,
            "endZone": "M",
            "endZonePosition": "table-centre"
          }
        },
        {
          "key": "standard-shot-middle-and-extension",
          "title": {
            "en": "First the middle, then the Run-out",
            "nl": "Eerst het midden, daarna de Uitloop"
          },
          "text": {
            "en": "The standard stroke is based on letting ball 1 roll out toward the middle of the table. That middle zone is the first reference. In a later phase, the route was extended through Leg to Heel A using manual table tests and Kruin configuration. In this course, Leg and Heel together are called the Run-out. Treat the Run-out as a tested extension, not as the original middle reference.",
            "nl": "De standaardstoot is gebaseerd op het uitrollen van bal 1 naar de middenzone van het biljart. Die middenzone is het eerste ijkpunt. In een latere fase is de baan met handmatige tests en Kruinconfig via Been doorgetrokken naar A-Hiel. Been en Hiel heten in deze cursus samen de Uitloop. Beschouw de Uitloop als een geteste uitbreiding, niet als het oorspronkelijke midden-ijkpunt."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp",
              "kruis",
              "been",
              "hiel"
            ],
            "focusProfile": "les1",
            "role": "middle-reference-and-tested-extension",
            "endZone": "M",
            "testedExtension": [
              "been",
              "hiel.to"
            ]
          }
        },
        {
          "key": "lesson-waaier",
          "title": {
            "en": "Lesson · Fan",
            "nl": "Les · Waaier"
          },
          "text": {
            "en": "Choose Fan for the whole and HALF tracks. A HALF track lies exactly midway between its two neighbouring tracks for every known value.",
            "nl": "Kies Waaier om door de waaierstanden te gaan: basisspoor, HALF-stand en volgend spoor. De HALF-stand ligt voor iedere bekende waarde exact midden tussen de twee buursporen."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp",
              "kruis"
            ]
          }
        },
        {
          "key": "lesson-minus-start-plus",
          "title": {
            "en": "Lesson · Parallel (P)",
            "nl": "Les · Parallel (P)"
          },
          "text": {
            "en": "Choose Parallel (P) for parallel tracks. In/Out reverses the side: S+ starts inside and Body A arrives outside, so its South value decreases. S− works inversely. Body, Neck and Head are then calculated backwards parallel to the base track.",
            "nl": "Kies Parallel (P) voor parallelstanden rond het basisspoor. BiBu keert de zijde om: S+ begint binnen en A-Romp komt buiten aan, waardoor de Zuidwaarde daalt. S− werkt omgekeerd. Romp, Nek en Kop worden daarna parallel aan het basisspoor teruggerekend."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "kop",
              "nek",
              "romp",
              "kruis",
              "been",
              "hiel"
            ]
          }
        },
        {
          "key": "lesson-minus-start-plus-display",
          "title": {
            "en": "Lesson · View Parallel (P)",
            "nl": "Les · Parallel (P) bekijken"
          },
          "text": {
            "en": "Choose Static · whole track to see the complete chosen ± track. Line by line retains the current track but starts again at Nose. The complete thin base track always remains fixed. In table view, − stays on the left and + on the right. Tap the centre to switch between Track and Line. The central menu also has Back to base track, for example FIVE+2 → FIVE.",
            "nl": "Kies Statisch · heel spoor om het volledige gekozen ±spoor te zien. Lijn voor lijn behoudt het huidige spoor, maar begint opnieuw bij Neus. Het volledige dunne basisspoor blijft altijd vast staan. In tafelbeeld blijft − links en + rechts. Tik in het midden om tussen Spoor en Lijn te wisselen. In het centrale menu staat ook Terug naar basisspoor, bijvoorbeeld VIJF+2 → VIJF."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "kop",
              "nek",
              "romp",
              "kruis",
              "been",
              "hiel"
            ],
            "role": "parallel-display-modes"
          }
        },
        {
          "key": "lesson-line-by-line-reset",
          "title": {
            "en": "Lesson · Restart and base track",
            "nl": "Les · Herstart en basisspoor"
          },
          "text": {
            "en": "When you choose Line by line, the current track remains selected and the comparison restarts at Nose. Use Back to base track in the central menu only when you also want to remove the −/+ offset, for example FIVE+2 → FIVE. That action also restarts at Nose.",
            "nl": "Wanneer je Lijn voor lijn kiest, blijft het huidige spoor geselecteerd en begint de vergelijking opnieuw bij Neus. Gebruik Terug naar basisspoor in het centrale menu alleen wanneer ook de −/+ verschuiving weg moet, bijvoorbeeld VIJF+2 → VIJF. Ook die actie begint opnieuw bij Neus."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "kop",
              "nek",
              "romp"
            ],
            "role": "line-reset-base-track"
          }
        },
        {
          "key": "diamond-lines",
          "title": {
            "en": "Every cushion has its own diamond line",
            "nl": "Iedere band heeft een eigen stiplijn"
          },
          "text": {
            "en": "A diamond line is the measuring line along one cushion that connects its diamonds. The four cushions therefore have four separate diamond lines. V and A always refer to one of these lines, never to the cushion edge.",
            "nl": "Een stiplijn is de meetlijn langs één band die de stippen van die band verbindt. De vier banden hebben dus vier afzonderlijke stiplijnen. V en A verwijzen altijd naar zo'n stiplijn, nooit naar de bandrand."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "emphasize": "guides"
          }
        },
        {
          "key": "running-or-reverse",
          "title": {
            "en": "+ running · − reverse",
            "nl": "+ mee · − contra"
          },
          "text": {
            "en": "A line starts as + (running). If the ball and therefore the line skip a cushion, the framework changes and the state switches to − (reverse). That state continues until another cushion is skipped. In Track FOUR, Body East–West causes the switch; Cross West–South remains reverse. In Track FIVE, the first switch occurs at Leg West–East.",
            "nl": "Een lijn begint op + (mee). Slaan de bal en dus de lijn een band over, dan verandert het Karkas en schakelt de loop naar − (contra). Die stand blijft gelden tot een volgende bandoverslag. Bij VIER veroorzaakt Romp Oost–West de omschakeling; Kruis West–Zuid blijft contra. Bij VIJF gebeurt de eerste omschakeling bij Been West–Oost."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "kruis",
              "been"
            ]
          }
        },
        {
          "key": "rule-direction",
          "title": {
            "en": "Rule · Dir",
            "nl": "Regel · Dir"
          },
          "text": {
            "en": "Dir records the cushion order. Every A names the next cushion, but the order can differ by track. Track FIVE uses S–W–N–E–S–W–E–N. Track FOUR uses S–W–N–E–W–S–E–N.",
            "nl": "Dir noteert de bandvolgorde. Iedere A noemt de volgende band, maar de volgorde kan per spoor verschillen. Spoor VIJF gebruikt S–W–N–O–Z–W–O–N. Spoor VIER gebruikt S–W–N–O–W–Z–O–N."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "kop",
              "nek",
              "romp",
              "kruis",
              "been",
              "hiel"
            ]
          }
        },
        {
          "key": "track-four-body-cross",
          "title": {
            "en": "Track FOUR · East to West",
            "nl": "Spoor VIER · Oost naar West"
          },
          "text": {
            "en": "In Track FOUR, Body runs directly from East to West. At the same ball on the West cushion, Cross takes over and runs with reverse English toward the South cushion. After Cross, the Run-out follows: Leg + Heel. The configured Cross angle determines the exact South arrival.",
            "nl": "In Spoor VIER loopt Romp rechtstreeks van Oost naar West. Op dezelfde bal aan de Westband neemt Kruis over en loopt met contra-effect naar de Zuidband. Na Kruis volgt de Uitloop: Been + Hiel. De geconfigureerde Kruishoek bepaalt de precieze aankomst op Zuid."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIER",
            "parts": [
              "romp",
              "kruis",
              "been",
              "hiel"
            ],
            "tables": [
              "klein",
              "groot"
            ],
            "focusProfile": "actieveLijn",
            "emphasize": "romp-kruis",
            "loop": "-"
          }
        },
        {
          "key": "rule-reflection",
          "title": {
            "en": "Rule · incidence equals reflection",
            "nl": "Regel · hoek van inval is hoek van uitval"
          },
          "text": {
            "en": "For every LSL track, Heel is provisionally derived by reflecting Leg at the East cushion: the angle of incidence equals the angle of reflection. Heel remains reverse until a later cushion skip changes the state.",
            "nl": "Voor ieder LKL-spoor wordt Hiel voorlopig afgeleid door Been op de Oostband te spiegelen: hoek van inval is hoek van uitval. Hiel blijft contra totdat een latere bandoverslag de stand verandert."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "been",
              "hiel"
            ]
          }
        },
        {
          "key": "rule-bibu",
          "title": {
            "en": "Rule · In/Out",
            "nl": "Regel · BiBu"
          },
          "text": {
            "en": "In/Out describes the relation between departure and Body arrival. S+1 starts inside and arrives outside on the South cushion; S−1 starts outside and arrives inside.",
            "nl": "BiBu beschrijft de relatie tussen start en Romp A. S+1 begint binnen (Bi) en komt op de Zuidband buiten (Bu) aan; S−1 begint buiten en komt binnen aan."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ]
          }
        },
        {
          "key": "rule-small-arrival-row",
          "title": {
            "en": "All balls together!",
            "nl": "Alle ballen verzamelen!"
          },
          "text": {
            "en": "Choose Parallel (P) and Arrivals. Only the base Body line is shown, with every S−2 through S+2 arrival ball physically against cushion 4 (South). On the Small table they form a row of five exactly adjacent balls. For other lines or tables, the balls may touch, overlap or lie apart.",
            "nl": "Kies Parallel (P) en Aankomsten. Je ziet alleen de basisromp met op Romp A alle aankomstballen van S−2 tot en met S+2 werkelijk tegen band 4 (Zuid). Op Klein vormen zij een rij van vijf ballen die precies naast elkaar liggen. Bij andere lijnen of tafels kunnen de ballen naast elkaar liggen, overlappen of uit elkaar liggen."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "romp"
            ],
            "tables": [
              "klein"
            ],
            "showArrivalSeries": true,
            "offsets": [
              -2,
              -1,
              0,
              1,
              2
            ]
          }
        },
        {
          "key": "head-neck-experience-anchors",
          "title": {
            "en": "Experience anchors · Head and Neck",
            "nl": "Ervaringsankers · Kop en Nek"
          },
          "text": {
            "en": "Small Head A: FOUR N28, FIVE N19, SIX N10. Large Head A / Neck A: FOUR N25 / E10, FIVE N15 / E20, SIX N10 / E30. Head A is also the starting anchor for the shortened four-cushion route.",
            "nl": "Klein Kop A: VIER N28, VIJF N19, ZES N10. Groot Kop A / Nek A: VIER N25 / O10, VIJF N15 / O20, ZES N10 / O30. Kop A is ook het uitgangsanker voor de verkorte vierbander."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "kop",
              "nek"
            ],
            "tables": [
              "groot",
              "klein"
            ]
          }
        },
        {
          "key": "rule-position-to-line",
          "title": {
            "en": "Rule · Position to line",
            "nl": "Regel · Positie naar lijn"
          },
          "text": {
            "en": "Starting from a known position on the current line, determine which next line must be played. First application: Body A determines Cross, departing at 45 degrees. More position-to-line relations will be added later.",
            "nl": "Ga uit van een bekende positie op de huidige lijn en bepaal welke volgende lijn gespeeld moet worden. Eerste toepassing: Romp A bepaalt Kruis, dat onder 45 graden vertrekt. Meer positie-naar-lijnrelaties volgen later."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "romp",
              "kruis"
            ]
          }
        },
        {
          "key": "why",
          "title": {
            "en": "Why 3B?",
            "nl": "Waarom deze app?"
          },
          "text": {
            "en": "Models based on ‘basic fifty’ use the Corner position. But in a diamond system, where exactly is the cue ball—at which diamond? Without a defined line or projection rule, that is not unambiguous.",
            "nl": "Modellen die gebruikmaken van ‘basis vijftig’ gebruiken de positie Hoek. Maar als je een stippensysteem hanteert: waar ligt de speelbal precies—bij welke stip? Zonder vastgelegde lijn of projectieregel is dat niet eenduidig."
          },
          "image": {
            "source": "schematic",
            "line": "VIJF",
            "parts": [],
            "cornerBall": true,
            "cueBallPosition": {
              "key": "hoek",
              "labels": {
                "en": "Corner",
                "nl": "Hoek"
              },
              "reference": "inner_cushion_edges",
              "rightDistanceBallDiameters": 1,
              "southDistanceBallDiameters": 1
            }
          }
        },
        {
          "key": "checked-lines",
          "title": {
            "en": "I record lines",
            "nl": "Ik noteer lijnen"
          },
          "text": {
            "en": "I record complete lines I have played and checked repeatedly—not isolated diamonds.",
            "nl": "Ik noteer volledige lijnen die ik zelf heb gespeeld en meermalen heb gecontroleerd—geen losse stippen."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ]
          }
        },
        {
          "key": "av",
          "title": {
            "en": "A and V belong to diamond lines",
            "nl": "A en V horen bij de stiplijnen"
          },
          "text": {
            "en": "A is arrival and V is departure. Every value refers to a diamond and its diamond line. The cushion edge is visible, but is never the measuring line.",
            "nl": "A is aankomst en V is vertrek. Iedere waarde verwijst naar een stip en de bijbehorende stiplijn. Een stiplijn loopt langs één band en verbindt de stippen van die band; iedere band heeft een eigen stiplijn. De bandrand blijft zichtbaar, maar is nooit de meetlijn."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus",
              "romp"
            ],
            "emphasize": "guides"
          }
        },
        {
          "key": "shift",
          "title": {
            "en": "Shift names the next line",
            "nl": "Schuif benoemt de volgende lijn"
          },
          "text": {
            "en": "SHIFT moves the complete line setup. FIVE can become SIX, and the same naming extends to ZERO and later lines. The line—not one diamond—is the unit.",
            "nl": "SCHUIF verplaatst de volledige spooropzet. Spoor VIJF wordt zo Spoor ZES; dezelfde naamgeving geldt ook voor Spoor NUL en latere sporen. Het spoor—niet één stip of lijnstuk—is de eenheid."
          },
          "image": {
            "source": "KruinLines",
            "line": "VIJF",
            "parts": [
              "neus"
            ]
          }
        }
      ]
    }
  ],
  "title": {
    "nl": "Bal zoekt spoor",
    "en": "Ball seeks track"
  },
  "tagline": {
    "nl": "Een spoor om te proberen. Jouw tafel geeft antwoord.",
    "en": "A track to try. Your table gives the answer."
  }
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

return {id:"kruin-v178-803d6e6d42dfb24441e9",label:"Kruin v178 · Kruinconfig",config:window.THREEB_START_CONFIG,values:{"onscreenMenu":{"groups":{"edit":{"order":20,"visible":true,"zone":"bottom"},"menuPanel":{"order":30,"visible":true,"zone":"bottom"},"menuToggle":{"order":10,"visible":true,"zone":"bottom"},"next":{"order":10,"visible":true,"zone":"right"},"previous":{"order":10,"visible":true,"zone":"left"},"track":{"order":10,"visible":true,"zone":"top"}},"safeGapPx":10,"zones":["top","left","right","bottom"]},"release":178,"savedSpoorValues":[],"source":"Kruinconfig-3B-v178.ods","tracks":{"groot":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":18},"rompV":{"band":"oost","value":48}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":20.599},"rompV":{"band":"oost","value":44}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.197},"rompV":{"band":"oost","value":39}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":20},"rompV":{"band":"oost","value":42.5}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":15},"neusA":{"band":"west","value":45}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12.5},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":32},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":33.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":40}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":15},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":36},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":6},"nekA":{"band":"oost","value":32},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":33.401},"rompV":{"band":"oost","value":24}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":36},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":30.803},"rompV":{"band":"oost","value":28}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":41},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":28.204},"rompV":{"band":"oost","value":33}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":24},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":38.599},"rompV":{"band":"oost","value":16}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":20},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":41.197},"rompV":{"band":"oost","value":12}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":28},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":43},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":25.401},"rompV":{"band":"oost","value":34}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":4},"nekA":{"band":"oost","value":48},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":22.803},"rompV":{"band":"oost","value":39}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":30.599},"rompV":{"band":"oost","value":26}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":30},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":33.197},"rompV":{"band":"oost","value":21}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":22},"rompV":{"band":"oost","value":37}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19.401},"rompV":{"band":"oost","value":42}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":24.599},"rompV":{"band":"oost","value":32}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":27.197},"rompV":{"band":"oost","value":27}}},"klein":{"ACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":2},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":19},"rompV":{"band":"oost","value":43}},"ACHT-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":21.14},"rompV":{"band":"oost","value":39}},"ACHT-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":23.278},"rompV":{"band":"oost","value":35}},"DRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"DRIE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"DRIE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"DRIE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60}},"DRIE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"DRIE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"EEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"EEN+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"EEN+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"EEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"HALFACHT":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":75},"rompA":{"band":"zuid","value":19.5},"rompV":{"band":"oost","value":39}},"HALFDRIE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":25}},"HALFEEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":5}},"HALFTWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":15}},"HALFVIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":35}},"HALFVIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":23.5},"neusA":{"band":"west","value":45},"rompA":{"band":"zuid","value":54},"rompV":{"band":"oost","value":12.5}},"HALFZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":14.5},"neusA":{"band":"west","value":55},"rompA":{"band":"zuid","value":34},"rompV":{"band":"oost","value":25}},"HALFZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":65},"rompA":{"band":"zuid","value":25},"rompV":{"band":"oost","value":32.5}},"NUL":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"NUL+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"NUL+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"NUL+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":20}},"TWEE+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":30}},"TWEE+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":40}},"TWEE+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50}},"TWEE-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":10}},"TWEE-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":0}},"VIER":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"zuid","crossLoopOverride":"-","kopA":{"band":"noord","value":28},"neusA":{"band":"west","value":40},"rompA":{"band":"west","value":10},"rompV":{"band":"oost","value":10}},"VIER+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":14},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":67.861},"rompV":{"band":"oost","value":7}},"VIER+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":20},"nekA":{"band":"oost","value":17},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":65.722},"rompV":{"band":"oost","value":10}},"VIER+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":19},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":63.583},"rompV":{"band":"oost","value":12}},"VIER-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":32},"nekA":{"band":"oost","value":10},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":72.14},"rompV":{"band":"oost","value":3}},"VIER-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":36},"nekA":{"band":"oost","value":7},"neusA":{"band":"west","value":20},"rompA":{"band":"zuid","value":74.278},"rompV":{"band":"oost","value":0}},"VIJF":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":19},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":38},"rompV":{"band":"oost","value":20}},"VIJF+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":17},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":35.861},"rompV":{"band":"oost","value":23}},"VIJF+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":13},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":33.722},"rompV":{"band":"oost","value":27}},"VIJF+3":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":11},"nekA":{"band":"oost","value":42},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":31.583},"rompV":{"band":"oost","value":30}},"VIJF-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":22},"nekA":{"band":"oost","value":29},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":40.14},"rompV":{"band":"oost","value":17}},"VIJF-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":25},"nekA":{"band":"oost","value":25},"neusA":{"band":"west","value":30},"rompA":{"band":"zuid","value":42.278},"rompV":{"band":"oost","value":13}},"ZES":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":10},"neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":30},"rompV":{"band":"oost","value":30}},"ZES+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":7},"nekA":{"band":"oost","value":45},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":27.861},"rompV":{"band":"oost","value":33}},"ZES+2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"nekA":{"band":"oost","value":49},"neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":25.722},"rompV":{"band":"oost","value":37}},"ZES-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":12},"nekA":{"band":"oost","value":39},"neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":32.14},"rompV":{"band":"oost","value":27}},"ZES-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":16},"nekA":{"band":"oost","value":35},"neusA":{"band":"west","value":40},"rompA":{"band":"zuid","value":34.278},"rompV":{"band":"oost","value":23}},"ZEVEN":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","kopA":{"band":"noord","value":5},"neusA":{"band":"west","value":70},"rompA":{"band":"zuid","value":23},"rompV":{"band":"oost","value":35}},"ZEVEN+1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":80},"rompA":{"band":"zuid","value":17.861},"rompV":{"band":"oost","value":39}},"ZEVEN-1":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":60},"rompA":{"band":"zuid","value":22.14},"rompV":{"band":"oost","value":31}},"ZEVEN-2":{"beenA":{"band":"oost","value":10},"crossAngleDeg":45.0,"crossArrivalBand":"west","neusA":{"band":"west","value":50},"rompA":{"band":"zuid","value":24.278},"rompV":{"band":"oost","value":26}}}}}};})());
