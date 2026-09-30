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
      if (pageErrors.length) throw new Error(`Schermfout: ${pageErrors.join(" | ")}`);
      await page.close();
    }
    console.log("UI-REGRESSIECONTROLE OK");
    console.log("Desktop, mobiel, menuvelden, Nederlands, JSON-verwijdering en VIJF → VIJF+1 zijn getest.");
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
