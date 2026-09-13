window.THREEB_START_CONFIG = {
  version: 2, release: "9",
  defaultLanguage: "en", defaultTableMode: "groot", defaultDirection: "west", defaultDeparture: "neus",
  tables: {
    klein: { labels: { en: "Small", nl: "Klein" }, widthCm: 115, heightCm: 230, dotOffsetCm: 9.5 },
    groot: { labels: { en: "Large", nl: "Groot" }, widthCm: 142, heightCm: 284, dotOffsetCm: 9.5 }
  },
  ballDiameterMm: 61.5,
  patterns: ["VIJF","ZES","ZEVEN","ACHT","NEGEN","TIEN","ELF","TWAALF"],
  patternLabels: {
    VIJF:{en:"FIVE",nl:"VIJF"}, ZES:{en:"SIX",nl:"ZES"}, ZEVEN:{en:"SEVEN",nl:"ZEVEN"}, ACHT:{en:"EIGHT",nl:"ACHT"},
    NEGEN:{en:"NINE",nl:"NEGEN"}, TIEN:{en:"TEN",nl:"TIEN"}, ELF:{en:"ELEVEN",nl:"ELF"}, TWAALF:{en:"TWELVE",nl:"TWAALF"}
  },
  lines: [
    {key:"neus",labels:{en:"Nose",nl:"Neus"},color:"#1778d4"},
    {key:"kop",labels:{en:"Head",nl:"Kop"},color:"#ee6b2f"},
    {key:"nek",labels:{en:"Neck",nl:"Nek"},color:"#8654c7"},
    {key:"romp",labels:{en:"Body",nl:"Romp"},color:"#15966f"},
    {key:"kruis",labels:{en:"Cross",nl:"Kruis"},color:"#db3f64"},
    {key:"been",labels:{en:"Leg",nl:"Been"},color:"#d5a21d"}
  ],
  departureOptions: ["neus","kop"],
  defaults: {
    klein:{VIJF:{
      neus:{from:{kind:"acquit",value:"Z"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:38.015302},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:15},to:{band:"oost",value:29.587522}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}}
    }},
    groot:{VIJF:{
      neus:{from:{kind:"acquit",value:"Z"},to:{band:"west",value:50}},
      kop:{from:{band:"west",value:38.015302},to:{band:"noord",value:19}},
      nek:{from:{band:"noord",value:15},to:{band:"oost",value:29.587522}},
      romp:{from:{band:"oost",value:20},to:{band:"zuid",value:38}}
    }}
  }
};
