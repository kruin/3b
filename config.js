window.TAFEL_STARTCONFIG = {
  version: 1,
  tables: {
    klein: { label: "Klein", widthCm: 115, heightCm: 230, dotOffsetCm: 9.5 },
    groot: { label: "Groot", widthCm: 142, heightCm: 284, dotOffsetCm: 9.5 }
  },
  ballDiameterMm: 61.5,
  patterns: ["VIJF", "ZES", "ZEVEN", "ACHT", "NEGEN", "TIEN", "ELF", "TWAALF"],
  lines: [
    { key: "neus", label: "Neuslijn", color: "#1778d4" },
    { key: "kop", label: "Koplijn", color: "#ee6b2f" },
    { key: "nek", label: "Neklijn", color: "#8654c7" },
    { key: "romp", label: "Romplijn", color: "#15966f" },
    { key: "kruis", label: "Kruislijn", color: "#db3f64" },
    { key: "linkerbeen", label: "Linkerbeenlijn", color: "#d5a21d" },
    { key: "rechterbeen", label: "Rechterbeenlijn", color: "#31a4ad" }
  ],
  defaults: {
    klein: {
      VIJF: {
        neus: { from: { kind: "acquit", value: "Z" }, to: { band: "west", value: 50 } },
        kop: { from: { band: "west", value: 38.015302 }, to: { band: "noord", value: 19 } },
        nek: { from: { band: "noord", value: 15 }, to: { band: "oost", value: 29.587522 } },
        romp: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 38 } }
      }
    },
    groot: {
      VIJF: {
        neus: { from: { kind: "acquit", value: "Z" }, to: { band: "west", value: 50 } },
        kop: { from: { band: "west", value: 38.015302 }, to: { band: "noord", value: 19 } },
        nek: { from: { band: "noord", value: 15 }, to: { band: "oost", value: 29.587522 } },
        romp: { from: { band: "oost", value: 20 }, to: { band: "zuid", value: 38 } }
      }
    }
  }
};
