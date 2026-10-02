"use strict";

const fs = require("fs");
const vm = require("vm");

const read = file => fs.readFileSync(file, "utf8");
const app = read("app-v178.js");
const configText = read("config-v178.js");
const kruinText = read("kruinwaarden-generated-v178.js");
const html = read("index.html");
const css = read("styles.css");
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function loadBrowserScript(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context);
  return context.window;
}

const configWindow = loadBrowserScript(configText);
const kruinWindow = loadBrowserScript(kruinText);
const C = configWindow.THREEB_START_CONFIG;
const K = kruinWindow.THREEB_KRUIN_VALUES;

check(C?.defaultLanguage === "nl", "Standaardtaal moet Nederlands zijn.");
check(/<html lang="nl">/.test(html), "De documenttaal van index.html moet Nederlands zijn.");
check(/ui\.language=\["en","nl"\]\.includes\(ui\.language\)\?ui\.language:"nl"/.test(app), "Terugvaltaal moet Nederlands zijn.");
check(JSON.stringify(C?.userAccess?.storageModes) === JSON.stringify(["account"]), "Alleen account/database-opslag mag actief zijn.");
check(/\$\("exportJson"\)\?\.remove\(\)/.test(app), "JSON-export moet uit de gebruikersinterface worden verwijderd.");
check(/\$\("importJson"\)\?\.closest\("\.file-button"\)\?\.remove\(\)/.test(app), "JSON-import moet uit de gebruikersinterface worden verwijderd.");
check(html.includes("Parallel (P)"), "Het menu moet Parallel (P) tonen.");
check(!/−S\+|-S\+/.test(html + app + configText), "De oude naam −S+ staat nog in app, menu of config.");
check(app.includes("function applyParallelNose"), "De centrale parallelcorrectie voor de Neus ontbreekt.");
check(app.includes('source:"parallel_translation"'), "Parallel-Neus wordt niet herkenbaar als lijntranslatie opgeslagen.");
check(app.includes('arrivalMode()&&line.key!=="neus"&&baseSegment?copy(baseSegment):variantSegment(t,line,index)'), "Aankomsten zet de gekozen Neus nog terug op het basisspoor.");
check(css.includes(".menu-settings-grid"), "De zichtbare instellingenopmaak ontbreekt.");

const menuControlIds = [
  "languageSelect", "addressForm", "noseDirection", "departureLine",
  "correctionMode", "valueStyle", "ballColor", "ballMarking", "playRange"
];
for (const id of menuControlIds) {
  check(html.includes(`id="${id}"`), `Menuveld ${id} ontbreekt in index.html.`);
  check(app.includes(`"${id}"`), `Menuveld ${id} wordt niet naar het zichtbare menu gebracht.`);
}
check(app.includes('["addressForm","addressForm"]'), "Aanspreekvorm reageert niet op wijzigingen.");
check(app.includes("ensureSettingsMenuUi();ensureOnscreenMenuLayout()"), "Instellingenmenu wordt niet vóór de tafelopmaak opgebouwd.");

for (const ref of ["styles.css?v=178", "config-v178.js", "kruinwaarden-generated-v178.js", "app-v178.js"]) {
  check(html.includes(ref), `Versieverwijzing ontbreekt of wijkt af: ${ref}.`);
}

const step = Number(C?.lineOneVariants?.parallel?.longRailUnitsPerStep);
check(step === 10, "Een Parallel-stap moet 10 eenheden op de lange stiplijn zijn.");
for (const table of Object.keys(C?.tables || {})) {
  const h = Number(C.tables[table].heightCm);
  for (const pattern of C?.lklTrackRules?.appliesTo || []) {
    const base = Number(C?.lklTrackRules?.noseArrivalByTrack?.[pattern]);
    if (!Number.isFinite(base)) continue;
    for (let offset = -2; offset <= 3; offset++) {
      const arrival = base + offset * step;
      if (arrival < 0 || arrival > 80) continue;
      const baseStartY = h * 0.75;
      const shiftedStartY = h * (0.75 - offset / 8);
      const baseArrivalY = (1 - base / 80) * h;
      const shiftedArrivalY = (1 - arrival / 80) * h;
      const startShift = shiftedStartY - baseStartY;
      const arrivalShift = shiftedArrivalY - baseArrivalY;
      check(Math.abs(startShift - arrivalShift) < 1e-9, `${table} ${pattern}${offset >= 0 ? "+" : ""}${offset}: Neus is niet parallel.`);
      const configured = K?.tracks?.[table]?.[`${pattern}${offset > 0 ? "+" : ""}${offset}`]?.neusA?.value;
      if (offset && configured !== undefined) check(Number(configured) === arrival, `${table} ${pattern}: databasewaarde van Neus A botst met Parallel (P).`);
    }
  }
}

if (errors.length) {
  console.error("REGRESSIECONTROLE MISLUKT");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log("REGRESSIECONTROLE OK");
console.log("Menu, config, Nederlands, database-opslag, Parallel (P), Neus-richting en versieverwijzingen zijn gecontroleerd.");
