"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const executablePath=process.env.CHROMIUM_PATH||chromium.executablePath();
if (!fs.existsSync(executablePath)) {
  console.log("UI-REGRESSIECONTROLE OVERGESLAGEN");
  console.log("Installeer een Playwright Chromium-browser om ook de echte desktop- en mobiele schermtest te draaien.");
  process.exit(0);
}

const root = __dirname;
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".md":"text/markdown; charset=utf-8" };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const file = path.resolve(root, relative.endsWith("/") ? `${relative}index.html` : relative);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
});

function parallel(a, b) {
  const ax = a.x2 - a.x1, ay = a.y2 - a.y1, bx = b.x2 - b.x1, by = b.y2 - b.y1;
  return Math.abs(ax * by - ay * bx) < 0.05;
}

(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true, executablePath, args:["--no-sandbox","--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader","--no-zygote"] });
  try {
    for (const viewport of [{ width:1280, height:900 }, { width:390, height:844 }]) {
      const page = await browser.newPage({ viewport, hasTouch:viewport.width<500, isMobile:viewport.width<500 });
      const pageErrors = [];
      page.on("pageerror", error => pageErrors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/#owner=kruin`, { waitUntil:"domcontentloaded" });
      await page.waitForSelector(".table-svg");
      if (await page.locator("#tableStartCue").isVisible()) await page.locator("#tableStartCue").click();
      if ((await page.locator("#languageSelect").inputValue()) !== "nl") throw new Error("Nederlands is niet de schermstandaard.");
      await page.locator("#bandMenu").click();
      await page.waitForSelector(".central-track-controls", { state:"visible" });
      if ((await page.locator("#trackFamilySelect option[value=parallel]").textContent()).trim() !== "Parallel (P)") throw new Error("Parallel (P) ontbreekt in het menu.");
      if(viewport.width<500)await page.locator("#menuSettings summary").tap();else await page.locator("#menuSettings summary").click();
      for (const id of ["languageSelect","addressForm","noseDirection","departureLine","valueStyle","ballColor","ballMarking","playRange","userSettingsButton"]) {
        if (!(await page.locator(`#${id}`).isVisible())) throw new Error(`${id} is niet zichtbaar in Instellingen.`);
      }
      if (await page.locator("#exportJson").count()) throw new Error("JSON-export staat nog in de interface.");
      if (await page.locator("#importJson").count()) throw new Error("JSON-import staat nog in de interface.");
      for(const id of ["noseDirection","ballColor","userSettingsButton"]){
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        const reachable=await page.locator(`#${id}`).evaluate(node=>{const b=node.getBoundingClientRect(),hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return hit===node||node.contains(hit);});
        if(!reachable)throw new Error(`${id} wordt door andere bediening afgedekt.`);
      }
      const panel = await page.locator(".central-track-controls").boundingBox();
      if (!panel || panel.x < -1 || panel.y < -1 || panel.x + panel.width > viewport.width + 1 || panel.y + panel.height > viewport.height + 1) throw new Error("Het menu valt buiten het scherm.");
      const oldFill=await page.locator(".cue-ball").first().getAttribute("fill");
      await page.locator("#ballColor").selectOption("yellow");
      if ((await page.locator(".cue-ball").first().getAttribute("fill"))===oldFill) throw new Error("Balkleur verandert niet.");
      await page.locator("#userSettingsButton").click();
      if (!(await page.locator("#userSettings").isVisible())) throw new Error("Weergavepaneel opent niet.");
      await page.locator("#closeUserSettings").click();
      await page.locator("#bandMenu").click();
      if ((await page.locator("#seriesFocusLabel").textContent()).trim() !== "Start") throw new Error("Start-label ontbreekt.");
      await page.locator("#trackFamilySelect").selectOption("parallel");
      await page.locator("#bandMenu").click();
      const line = async () => page.locator('g[data-part="neus"] line.route-line').first().evaluate(node => ({ x1:+node.getAttribute("x1"), y1:+node.getAttribute("y1"), x2:+node.getAttribute("x2"), y2:+node.getAttribute("y2") }));
      const base = await line();
      await page.locator("#centralLineSelect").selectOption("VIJF+1");
      const plusOne = await line();
      if (!parallel(base, plusOne)) throw new Error("VIJF en VIJF+1 hebben geen parallelle Neus.");
      if (!(await page.locator('.position-legend').textContent()).includes('Kruin')) throw new Error('Positiekleuren ontbreken.');
      await page.locator("#bandMenu").click();
      await page.screenshot({path:`/tmp/3b-${viewport.width}.png`});
      await page.locator("#parallelDisplaySelect").selectOption("line");
      await page.locator("#bandTrackValue").click();
      if(!(await page.locator("#lineEditor").isVisible()))throw new Error("Klik op Spoor opent config niet.");
      await page.locator("#bandLinePlus").click();
      if((await page.locator("#lineEditor").getAttribute("data-part"))!=="kop")throw new Error("Config volgt de lijnkeuze niet.");
      await page.locator("#lineToValue").fill("18");
      await page.locator("#lineToValue").dispatchEvent("input");
      if((await page.locator("#lineToValue").getAttribute("data-position-origin"))!=="edited")throw new Error("Config-edit krijgt niet de kleur Bewerkt.");
      await page.locator("#bandLinePlus").click();
      await page.locator("#bandLineMinus").click();
      if((await page.locator("#lineToValue").inputValue())!=="18")throw new Error("Config-edit verdwijnt na lijnwisseling.");
      await page.screenshot({path:`/tmp/3b-config-${viewport.width}.png`});
      await page.locator("#bandMenu").click();
      await page.locator("#parallelDisplaySelect").selectOption("whole");
      if(await page.locator("#lineEditor").isVisible())throw new Error("Automatisch configvenster blijft open buiten Lijn voor lijn.");
      for(const key of ["VIJF+2","VIJF+3"]){
        await page.locator("#bandMenu").click();await page.locator("#centralLineSelect").selectOption(key);
        if((await page.locator("#bandTrackValue").textContent())!==key)throw new Error(`${key} valt terug naar een ander spoor.`);
        if((await page.locator('g[data-part="neus"] .route-line').count())!==1)throw new Error(`${key}: Neus ontbreekt.`);
        if((await page.locator('g[data-part="neus"] .junction-ball').count())!==1)throw new Error(`${key}: bandbal ontbreekt.`);
      }
      await page.locator("#bandMenu").click();await page.locator("#centralTableMode").selectOption("klein");
      for(const [key,expected] of [["VIJF",83],["VIJF+1",83],["VIJF+2",83],["VIJF+3",83]]){
        await page.locator("#bandMenu").click();await page.locator("#centralLineSelect").selectOption(key);
        await page.locator("#bandMenu").click();await page.locator("#parallelDisplaySelect").selectOption("line");
        await page.locator("#bandLineValue").click();
        if(Number(await page.locator("#noseLengthValue").inputValue())!==expected)throw new Error(`${key}: verkeerde afstootlengte op Klein.`);
        await page.locator("#closeLineEditor").click();
      }
      await page.locator("#bandLineValue").click();await page.locator("#noseLengthValue").fill("85");await page.locator("#noseLengthValue").dispatchEvent("input");await page.locator("#closeLineEditor").click();
      await page.locator("#bandMenu").click();await page.locator("#centralLineSelect").selectOption("VIJF");await page.locator("#bandLineValue").click();
      if(Number(await page.locator("#noseLengthValue").inputValue())!==85)throw new Error('Gewijzigde Neuslengte werkt niet door naar het basisspoor.');
      await page.locator("#noseLengthValue").fill("83");await page.locator("#noseLengthValue").dispatchEvent("input");await page.locator("#closeLineEditor").click();
      await page.locator("#bandMenu").click();await page.locator("#seriesFocusSelect").selectOption("noord");
      if(!(await page.locator(".series-overview line[data-focus-part=kop]").count()))throw new Error("Start-focus toont geen overzicht.");
      await page.locator("#bandMenu").click();
      await page.locator(".selection-menu-header strong").scrollIntoViewIfNeeded();
      const oldMenu=await page.locator(".central-track-controls").boundingBox(),titleBox=await page.locator(".selection-menu-header strong").boundingBox();
      await page.mouse.move(titleBox.x+titleBox.width/2,titleBox.y+titleBox.height/2);await page.mouse.down();await page.mouse.move(titleBox.x+titleBox.width/2+10,titleBox.y+titleBox.height/2+20,{steps:6});await page.mouse.up();
      const newMenu=await page.locator(".central-track-controls").boundingBox();if(Math.abs(newMenu.y-oldMenu.y)<5)throw new Error("Selectiemenu is niet schuifbaar.");
      await page.waitForFunction(()=>Date.now()>Number(document.querySelector('.central-track-controls').dataset.suppressClickUntil||0));
      await page.locator("#closeSelectionMenu").click();
      if(await page.locator(".central-track-controls").isVisible())throw new Error("× sluit het menu niet.");
      const bar=await page.locator("#bandCore").boundingBox();const lineBefore=await page.locator("#bandLineValue").textContent();
      const dragTarget=await page.locator("#bandLinePlus").boundingBox();
      await page.mouse.move(dragTarget.x+dragTarget.width/2,dragTarget.y+dragTarget.height/2);await page.mouse.down();await page.mouse.move(dragTarget.x+dragTarget.width/2+12,dragTarget.y+dragTarget.height/2+70,{steps:8});await page.mouse.up();
      const movedBar=await page.locator("#bandCore").boundingBox();if(movedBar.y<bar.y+20)throw new Error("De hele balk is niet versleepbaar vanaf een knop.");
      if((await page.locator("#bandLineValue").textContent())!==lineBefore)throw new Error("Slepen voert een klikactie uit.");
      await page.evaluate(()=>{
        const key='3b-canonical-west-v2',state=JSON.parse(localStorage.getItem(key));
        Object.assign(state.ui,{departure:'kop',pattern:'VIJF',lineOneMode:'parallel',parallelOffset:1,trackFamily:'parallel',tableMode:'klein',editTable:'klein',parallelDisplay:'whole'});
        state.appliedMigrations=state.appliedMigrations.filter(x=>x!=='nose-presentation-v173');
        state.variantData??={};state.variantData.klein??={};state.variantData.klein['VIJF+1']=JSON.parse(JSON.stringify(state.data.klein.VIJF));
        state.variantData.klein['VIJF+1'].neus.to.value=null;
        localStorage.setItem(key,JSON.stringify(state));
      });
      await page.reload({waitUntil:'domcontentloaded'});
      if(!(await page.locator('g[data-part="neus"] .route-line').count()))throw new Error('Oud opgeslagen scherm mist nog steeds Neus.');
      if(!(await page.locator('g[data-part="neus"] .junction-ball').count()))throw new Error('Oud opgeslagen scherm mist nog steeds de bandbal.');
      if (pageErrors.length) throw new Error(`Schermfout: ${pageErrors.join(" | ")}`);
      await page.close();
    }
    console.log("UI-REGRESSIECONTROLE OK");
    console.log("Desktop/mobiel: menuvelden, config-edits, VIJF+2/+3, Neus/bandbal, gelijke Neuslengte Klein 83 cm, Start-focus, × en versleepbare menu’s zijn getest.");
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => {
  console.error("UI-REGRESSIECONTROLE MISLUKT");
  console.error(error.stack || error.message);
  server.close();
  process.exit(1);
});
