"use strict";
const fs = require("fs"), path = require("path"), cp = require("child_process");
const EXPECTED = require("./package.json").devDependencies.playwright;
function status(loader = require, exists = fs.existsSync) {
  try {
    if(loader === require)delete require.cache[require.resolve("playwright/package.json")];
    if (loader("playwright/package.json").version !== EXPECTED) return "versie";
    const executable = process.env.CHROMIUM_PATH || loader("playwright").chromium.executablePath();
    return exists(executable) ? "gereed" : "chromium";
  } catch (_) { return "playwright"; }
}
function ensure({check = status, run = (file, args) => cp.spawnSync(file, args, {cwd:__dirname, stdio:"inherit"}).status,
                 cli = () => path.join(path.dirname(require.resolve("playwright/package.json")), "cli.js"),
                 platform = process.platform, log = console.log} = {}) {
  if (Number(process.versions.node.split(".")[0]) < 20) throw Error("Node.js 20 of hoger is nodig.");
  let state = check();
  if (state === "gereed") { log("Playwright en Chromium zijn gereed."); return; }
  if (state === "playwright" || state === "versie") {
    log("3B installeert de vastgelegde Playwright-versie...");
    const code = platform === "win32"
      ? run(process.env.ComSpec || "cmd.exe", ["/d","/s","/c","npm ci --ignore-scripts --no-audit --no-fund"])
      : run("npm", ["ci","--ignore-scripts","--no-audit","--no-fund"]);
    if (code !== 0) throw Error("Installatie van Playwright is mislukt. Er wordt niets gepubliceerd.");
  }
  log("3B installeert Chromium voor de browsertests...");
  if (run(process.execPath, [cli(), "install", "chromium"]) !== 0) throw Error("Installatie van Chromium is mislukt. Er wordt niets gepubliceerd.");
  if (check() !== "gereed") throw Error("De browsertest-installatie is nog niet compleet. Er wordt niets gepubliceerd.");
}
module.exports = {status, ensure};
if (require.main === module) {
  try { ensure(); } catch (error) { console.error("FOUT: " + error.message); process.exitCode = 1; }
}
