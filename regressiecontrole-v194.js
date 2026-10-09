"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const read = file => fs.readFileSync(file, "utf8");
const app = read("app-v194.js");
const configText = read("config-v194.js");
const kruinText = read("kruinwaarden-generated-v194.js");
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
const expectedRelease = String(C?.publicRelease || C?.release || "");

function readRequired(file) {
  check(fs.existsSync(file), `Versiecontrole: vereist bestand ontbreekt: ${file}.`);
  return fs.existsSync(file) ? read(file) : "";
}

function checkOperationalVersionRefs(file, source) {
  for (const match of source.matchAll(/\bv(\d{3})\b/g)) {
    check(match[1] === expectedRelease, `Versiecontrole: ${file} verwijst naar v${match[1]} in plaats van v${expectedRelease}.`);
  }
}

check(/^\d{3}$/.test(expectedRelease), "Versiecontrole: config bevat geen geldig releasenummer.");
check(String(C?.release) === expectedRelease, `Versiecontrole: config.release is ${C?.release}, verwacht ${expectedRelease}.`);
check(String(C?.publicRelease) === expectedRelease, `Versiecontrole: config.publicRelease is ${C?.publicRelease}, verwacht ${expectedRelease}.`);
check(String(K?.release) === expectedRelease, `Versiecontrole: gegenereerde Kruininhoud is v${K?.release}, verwacht v${expectedRelease}.`);
check(path.basename(process.cwd()) === `3B-openbare-app-v${expectedRelease}`, `Versiecontrole: openbare mapnaam hoort 3B-openbare-app-v${expectedRelease} te zijn.`);

const ownVersion = path.basename(__filename).match(/-v(\d+)\.js$/)?.[1];
check(ownVersion === expectedRelease, `Versiecontrole: regressietest heet v${ownVersion || "?"}, maar config is v${expectedRelease}.`);

const configReleaseTags = [...configText.matchAll(/(?:publicRelease|["']release["']|\brelease)\s*:\s*["']?(\d{3})/g)].map(match => match[1]);
check(configReleaseTags.length >= 3, "Versiecontrole: niet alle releasevelden in config zijn gevonden.");
for (const release of configReleaseTags) check(release === expectedRelease, `Versiecontrole: config bevat intern nog release ${release}; verwacht ${expectedRelease}.`);

const versionFile = readRequired("VERSIE.txt").split(/\r?\n/, 1)[0].trim();
check(versionFile === `3B — versie ${expectedRelease}`, `Versiecontrole: eerste regel van VERSIE.txt bevat '${versionFile}', verwacht '3B — versie ${expectedRelease}'.`);
check(html.includes(`<title>3B v${expectedRelease} —`), `Versiecontrole: paginatitel noemt niet v${expectedRelease}.`);
check(html.includes(`styles.css?v=${expectedRelease}`), `Versiecontrole: stylesheet-query is niet v${expectedRelease}.`);
check(html.includes(`id="releaseVersion">${expectedRelease}</span>`), `Versiecontrole: statisch versienummer onderaan is niet ${expectedRelease}.`);

const expectedPublicFiles = [
  `app-v${expectedRelease}.js`, `config-v${expectedRelease}.js`,
  `kruinwaarden-generated-v${expectedRelease}.js`, `basis-catalogus-v${expectedRelease}.js`,
  `tafelbestanden-v${expectedRelease}.js`, `spoor-storage-v${expectedRelease}.js`,
  `controle-v${expectedRelease}.html`
];
for (const file of expectedPublicFiles) check(fs.existsSync(file), `Versiecontrole: ${file} ontbreekt.`);

const operationalPublicFiles = [
  "index.html", `controle-v${expectedRelease}.html`, "Publiceer_3B.bat",
  "Regressiecontrole_3B.bat", path.basename(__filename), "Activeer_Betalen.ps1",
  "Kruin.html", "PUBLICEREN.md"
];
for (const file of operationalPublicFiles) checkOperationalVersionRefs(file, readRequired(file));

const publishBat = readRequired("Publiceer_3B.bat");
check(publishBat.includes(`set "RELEASE=${expectedRelease}"`), `Versiecontrole: Publiceer_3B.bat gebruikt niet RELEASE=${expectedRelease}.`);
check(publishBat.includes(`styles.css?v=${expectedRelease}`), `Versiecontrole: Publiceer_3B.bat controleert niet styles.css?v=${expectedRelease}.`);
const userGuide = readRequired("HANDLEIDING-GEBRUIKER.md");
check(userGuide.includes(`Geldig voor versie ${expectedRelease}.`), `Versiecontrole: gebruikershandleiding is niet gemarkeerd voor versie ${expectedRelease}.`);
const controlPage = readRequired(`controle-v${expectedRelease}.html`);
check(controlPage.includes(`<strong>version ${expectedRelease}</strong>`), `Versiecontrole: controlepagina noemt inhoudelijk niet versie ${expectedRelease}.`);
const docIndex = readRequired(path.join("doc", "index.html"));
check(docIndex.includes(`3B-documentatie · v${expectedRelease}`), `Versiecontrole: documentatiekop is niet v${expectedRelease}.`);

const catalogText = readRequired(`basis-catalogus-v${expectedRelease}.js`);
check(catalogText.includes(`window.THREEB_DEFAULT_BASIS="kruin-v${expectedRelease}-`), `Versiecontrole: standaardbasis is niet van v${expectedRelease}.`);
const currentBasisFiles = fs.existsSync("kruin-bases")
  ? fs.readdirSync("kruin-bases").filter(name => name.startsWith(`kruin-v${expectedRelease}-`))
  : [];
check(currentBasisFiles.filter(name => name.endsWith(".js")).length === 1, `Versiecontrole: verwacht precies één actuele v${expectedRelease}-basis in JS.`);
check(currentBasisFiles.filter(name => name.endsWith(".sqlite3")).length === 1, `Versiecontrole: verwacht precies één actuele v${expectedRelease}-basis in SQLite.`);

const privateDir = path.resolve("..", `3B-private-Kruinconfig-v${expectedRelease}`);
if (fs.existsSync(privateDir)) {
  const privateRead = file => readRequired(path.join(privateDir, file));
  check(path.basename(privateDir) === `3B-private-Kruinconfig-v${expectedRelease}`, `Versiecontrole: private mapnaam wijkt af van v${expectedRelease}.`);
  const privateBat = privateRead("Publiceer_KruinBeheer.bat");
  const privateCommand = privateRead("Publiceer_KruinBeheer.command");
  check(privateBat.includes(`set "RELEASE=${expectedRelease}"`), `Versiecontrole: private Windows-publicatie gebruikt niet RELEASE=${expectedRelease}.`);
  check(new RegExp(`^RELEASE=${expectedRelease}$`, "m").test(privateCommand), `Versiecontrole: private Mac-publicatie gebruikt niet RELEASE=${expectedRelease}.`);
  const privateGuide = privateRead("HANDLEIDING-KRUIN.md");
  check(privateGuide.includes(`Geldig voor versie ${expectedRelease}.`), `Versiecontrole: private handleiding is niet gemarkeerd voor versie ${expectedRelease}.`);
  const privateReadme = privateRead("README.md");
  check(privateReadme.includes(`private SQLite-beheerbron v${expectedRelease}`), `Versiecontrole: private README-kop is niet v${expectedRelease}.`);
  const beheerHtml = privateRead("SQLite-beheer.html");
  check(beheerHtml.includes(`SQLite-beheer · v${expectedRelease}`), `Versiecontrole: SQLite-beheerinhoud is niet v${expectedRelease}.`);
  check(beheerHtml.includes(`/config-v${expectedRelease}.js`), `Versiecontrole: SQLite-beheer laadt niet config-v${expectedRelease}.js.`);
  for (const file of ["Publiceer_KruinBeheer.bat", "Publiceer_KruinBeheer.command", "Bekijk_Kruinconfig.bat", "Bekijk_Kruinconfig.command", "SQLite-beheer.html"]) {
    checkOperationalVersionRefs(`private/${file}`, privateRead(file));
  }
}

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

for (const ref of ["styles.css?v=194", "config-v194.js", "kruinwaarden-generated-v194.js", "app-v194.js"]) {
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

check(C.lklTrackRules.appliesTo.includes("NEGEN") && C.patternByLine.NEGEN==="LKL", "NEGEN ontbreekt in de gewone LKL-keten.");
check(app.includes('document.querySelector(".central-track-controls").append(bar)'), "Undo moet binnen het sluitbare menu starten.");
check(app.includes('menu.append(bar)'), "Undo moet na de lijneditor terug naar het menu.");
check(app.includes("event.key==='Escape'"), "Escape moet het menu kunnen sluiten.");
check(C.speedProfiles.lkl.cushions===5 && C.speedProfiles.lkl.runOut.fraction===.5, "LKL-snelheid: 5 banden plus uitloop tot midden lijn 6.");
if (errors.length) {
  console.error("REGRESSIECONTROLE MISLUKT");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log("REGRESSIECONTROLE OK");
console.log("Menu, config, Nederlands, database-opslag, Parallel (P) en Neus-richting zijn gecontroleerd.");
console.log(`VERSIECONTROLE OK: v${expectedRelease} klopt in nummer, inhoud, bestandsnamen, openbare publicatie en aanwezige private beheerbestanden.`);
