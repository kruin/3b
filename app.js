(() => {
  "use strict";

  const START = window.TAFEL_STARTCONFIG;
  const STORAGE_KEY = "tafel-lijnconfig-v1";
  const STATE_VERSION = 2;
  const bandOptions = ["west", "noord", "oost", "zuid"];
  const bandLabels = { west: "West", noord: "Noord", oost: "Oost", zuid: "Zuid" };
  function el(id) { return document.getElementById(id); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  const state = loadState();
  let currentTable = state.ui?.table || "groot";
  let currentPattern = state.ui?.pattern || "VIJF";
  let noseDirection = state.ui?.noseDirection || "west";

  function blankPattern(direction = "west") {
    const pattern = {};
    START.lines.forEach(line => {
      pattern[line.key] = line.key === "neus"
        ? { from: { kind: "acquit", value: "Z" }, to: { band: direction, value: null } }
        : { from: { band: "", value: null }, to: { band: "", value: null } };
    });
    return pattern;
  }

  function buildInitialData() {
    const data = {};
    Object.keys(START.tables).forEach(table => {
      data[table] = {};
      START.patterns.forEach(pattern => {
        data[table][pattern] = blankPattern();
        const preset = START.defaults?.[table]?.[pattern];
        if (preset) Object.entries(preset).forEach(([key, value]) => data[table][pattern][key] = clone(value));
      });
    });
    return data;
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.data && (saved.version === 1 || saved.version === STATE_VERSION)) return migrateState(saved);
    } catch (_) {}
    return { version: STATE_VERSION, data: buildInitialData(), ui: { table: "groot", pattern: "VIJF", noseDirection: "west" } };
  }

  function migrateState(saved) {
    if (saved.version === 1) {
      Object.values(saved.data).forEach(patterns => Object.values(patterns || {}).forEach(pattern => {
        if (pattern?.neus?.to?.band !== "oost") return;
        Object.values(pattern).forEach(segment => [segment?.from, segment?.to].forEach(point => {
          if ((point?.band === "noord" || point?.band === "zuid") && Number.isFinite(Number(point.value))) {
            point.value = 40 - Number(point.value);
          }
        }));
      }));
      saved.version = STATE_VERSION;
    }
    return saved;
  }

  function normalizeState() {
    const defaults = buildInitialData();
    Object.keys(defaults).forEach(table => {
      state.data[table] ||= {};
      START.patterns.forEach(pattern => {
        state.data[table][pattern] ||= defaults[table][pattern];
        START.lines.forEach(line => state.data[table][pattern][line.key] ||= defaults[table][pattern][line.key]);
      });
    });
    state.ui ||= {};
  }

  function saveState() {
    state.ui = { table: currentTable, pattern: currentPattern, noseDirection };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    el("saveState").textContent = "Lokaal opgeslagen";
  }

  function currentData() { return state.data[currentTable][currentPattern]; }

  function init() {
    normalizeState();
    START.patterns.forEach(name => el("patternSelect").add(new Option(name, name)));
    el("patternSelect").value = currentPattern;
    el("noseDirection").value = noseDirection;
    bindControls();
    render();
  }

  function bindControls() {
    el("tableButtons").addEventListener("click", event => {
      const button = event.target.closest("button[data-table]");
      if (!button) return;
      currentTable = button.dataset.table;
      noseDirection = currentData().neus?.to?.band || "west";
      saveState(); render();
    });
    el("patternSelect").addEventListener("change", event => {
      currentPattern = event.target.value;
      noseDirection = currentData().neus?.to?.band || "west";
      saveState(); render();
    });
    el("noseDirection").addEventListener("change", event => {
      const previous = noseDirection;
      noseDirection = event.target.value;
      mirrorCurrentPattern(previous, noseDirection);
      saveState(); render();
    });
    el("exportSvg").addEventListener("click", exportSvg);
    el("exportJson").addEventListener("click", exportJson);
    el("importJson").addEventListener("change", importJson);
    el("resetPattern").addEventListener("click", resetPattern);
  }

  function mirrorBand(band) {
    if (band === "west") return "oost";
    if (band === "oost") return "west";
    return band;
  }

  function mirrorValue(band, value) {
    if (value === null || value === "" || !Number.isFinite(Number(value))) return value;
    return Number(value);
  }

  function mirrorCurrentPattern(previous, next) {
    if (previous === next) return;
    Object.values(currentData()).forEach(segment => {
      [segment.from, segment.to].forEach(point => {
        if (point.kind === "acquit") return;
        const oldBand = point.band;
        point.value = mirrorValue(oldBand, point.value);
        point.band = mirrorBand(oldBand);
      });
    });
    const nose = currentData().neus;
    nose.from = { kind: "acquit", value: "Z" };
    nose.to.band = next;
  }

  function render() {
    [...el("tableButtons").querySelectorAll("button")].forEach(button => button.classList.toggle("active", button.dataset.table === currentTable));
    el("noseDirection").value = noseDirection;
    el("editorTitle").textContent = `${START.tables[currentTable].label} · ${currentPattern}`;
    el("drawingTitle").textContent = `${currentPattern} · ${START.tables[currentTable].label}`;
    renderRows();
    renderDrawing();
  }

  function renderRows() {
    const tbody = el("lineRows");
    tbody.replaceChildren();
    const data = currentData();
    START.lines.forEach((line, index) => {
      const segment = data[line.key];
      const tr = document.createElement("tr");
      const name = document.createElement("td");
      name.className = "line-name";
      name.innerHTML = `<span class="line-swatch" style="background:${line.color}"></span>${line.label}`;
      tr.append(name);

      if (line.key === "neus") {
        const fixed = document.createElement("td");
        fixed.colSpan = 2;
        fixed.innerHTML = `<span class="fixed-z">Z</span>`;
        tr.append(fixed);
      } else {
        tr.append(makeBandCell(line.key, "from", segment.from.band));
        tr.append(makeValueCell(line.key, "from", segment.from.value));
      }
      tr.append(makeBandCell(line.key, "to", segment.to.band));
      tr.append(makeValueCell(line.key, "to", segment.to.value));

      const clearCell = document.createElement("td");
      const clear = document.createElement("button");
      clear.type = "button"; clear.className = "row-clear"; clear.title = `${line.label} wissen`; clear.textContent = "×";
      clear.addEventListener("click", () => { clearLine(line.key); saveState(); render(); });
      clearCell.append(clear); tr.append(clearCell);
      tbody.append(tr);
    });
  }

  function makeBandCell(lineKey, side, value) {
    const td = document.createElement("td");
    const select = document.createElement("select");
    select.setAttribute("aria-label", `${lineKey} ${side} band`);
    select.add(new Option("—", ""));
    bandOptions.forEach(band => select.add(new Option(bandLabels[band], band)));
    select.value = value || "";
    select.addEventListener("change", event => updatePoint(lineKey, side, "band", event.target.value));
    td.append(select); return td;
  }

  function makeValueCell(lineKey, side, value) {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number"; input.inputMode = "decimal"; input.step = "any"; input.placeholder = "—";
    input.setAttribute("aria-label", `${lineKey} ${side} stipwaarde`);
    input.value = value ?? "";
    input.addEventListener("input", event => updatePoint(lineKey, side, "value", event.target.value === "" ? null : Number(event.target.value)));
    td.append(input); return td;
  }

  function updatePoint(lineKey, side, field, value) {
    currentData()[lineKey][side][field] = value;
    saveState(); renderDrawing();
  }

  function clearLine(lineKey) {
    currentData()[lineKey] = lineKey === "neus"
      ? { from: { kind: "acquit", value: "Z" }, to: { band: noseDirection, value: null } }
      : { from: { band: "", value: null }, to: { band: "", value: null } };
  }

  function pointComplete(point) {
    return point.kind === "acquit" || (bandOptions.includes(point.band) && point.value !== null && point.value !== "" && Number.isFinite(Number(point.value)));
  }

  function pointValid(point) {
    if (point.kind === "acquit") return true;
    if (!pointComplete(point)) return false;
    const max = (point.band === "west" || point.band === "oost") ? 80 : 40;
    return Number(point.value) >= 0 && Number(point.value) <= max;
  }

  function completedSegments() {
    return START.lines.filter(line => {
      const s = currentData()[line.key];
      return pointComplete(s.from) && pointComplete(s.to) && pointValid(s.from) && pointValid(s.to);
    });
  }

  function resolvePoint(point, table) {
    const { widthCm: w, heightCm: h, dotOffsetCm: d } = table;
    if (point.kind === "acquit") return { x: w / 2, y: h * .75 };
    const v = Number(point.value);
    const mirrored = noseDirection === "oost";
    switch (point.band) {
      case "west": return { x: -d, y: (mirrored ? v / 80 : 1 - v / 80) * h };
      case "oost": return { x: w + d, y: (mirrored ? 1 - v / 80 : v / 80) * h };
      case "noord": return { x: (mirrored ? 1 - v / 40 : v / 40) * w, y: -d };
      case "zuid": return { x: (mirrored ? v / 40 : 1 - v / 40) * w, y: h + d };
      default: return null;
    }
  }

  const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

  function renderDrawing() {
    const table = START.tables[currentTable];
    const segments = completedSegments();
    const invalid = [];
    START.lines.forEach(line => {
      const s = currentData()[line.key];
      [s.from, s.to].forEach(point => { if (pointComplete(point) && !pointValid(point)) invalid.push(`${line.label}: waarde buiten bandbereik`); });
    });
    el("messages").innerHTML = invalid.map(message => `<div>${esc(message)}</div>`).join("");
    const status = el("completionStatus");
    status.textContent = `${segments.length}/7 lijnen`;
    status.classList.toggle("complete", segments.length === 7);

    const W = 590, H = 900, pad = 86;
    const usableW = W - pad * 2, usableH = H - pad * 2;
    const scale = Math.min(usableW / (table.widthCm + 2 * table.dotOffsetCm), usableH / (table.heightCm + 2 * table.dotOffsetCm));
    const fieldW = table.widthCm * scale, fieldH = table.heightCm * scale, d = table.dotOffsetCm * scale;
    const x = (W - fieldW) / 2, y = (H - fieldH) / 2 + 14;
    const map = p => ({ x: x + p.x * scale, y: y + p.y * scale });
    const dash = "4 6";
    let svg = `<svg id="tableSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(currentPattern)} volledige loop op ${esc(table.label)} tafel">`;
    svg += `<rect width="${W}" height="${H}" rx="18" fill="#f7f1e5"/>`;
    svg += `<text x="${W/2}" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="800" fill="#2b2118">${esc(currentPattern)} · ${esc(table.label.toUpperCase())}</text>`;
    svg += `<text x="${W/2}" y="50" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#6d5d4b">${table.widthCm} × ${table.heightCm} cm · stiplijnen 9,5 cm buiten band</text>`;
    svg += `<rect x="${x-22}" y="${y-22}" width="${fieldW+44}" height="${fieldH+44}" rx="10" fill="#704725" stroke="#3a2516" stroke-width="3"/>`;
    svg += `<rect x="${x}" y="${y}" width="${fieldW}" height="${fieldH}" fill="#176f4f" stroke="#e7c66e" stroke-width="3"/>`;
    svg += `<g stroke="#f1d792" stroke-width="1.6" stroke-dasharray="${dash}">`+
      `<line x1="${x-d}" y1="${y}" x2="${x-d}" y2="${y+fieldH}"/>`+
      `<line x1="${x+fieldW+d}" y1="${y}" x2="${x+fieldW+d}" y2="${y+fieldH}"/>`+
      `<line x1="${x}" y1="${y-d}" x2="${x+fieldW}" y2="${y-d}"/>`+
      `<line x1="${x}" y1="${y+fieldH+d}" x2="${x+fieldW}" y2="${y+fieldH+d}"/></g>`;
    svg += drawDots(table, map);
    svg += `<defs><marker id="arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto"><path d="M0 0L9 3.5L0 7Z" fill="context-stroke"/></marker></defs>`;

    segments.forEach(line => {
      const s = currentData()[line.key];
      const a = map(resolvePoint(s.from, table));
      const b = map(resolvePoint(s.to, table));
      svg += `<g data-line="${line.key}">`;
      svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#fff" stroke-opacity=".78" stroke-width="9"/>`;
      svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${line.color}" stroke-width="5" marker-end="url(#arrow)"/>`;
      svg += `<circle cx="${a.x}" cy="${a.y}" r="5" fill="#fffaf0" stroke="${line.color}" stroke-width="2.5"/>`;
      svg += `<circle cx="${b.x}" cy="${b.y}" r="5" fill="#fffaf0" stroke="${line.color}" stroke-width="2.5"/>`;
      const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
      svg += `<text x="${mx}" y="${my-8}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="#fff6dd" stroke="#103d2c" stroke-width="3" paint-order="stroke fill">${esc(line.label)}</text>`;
      svg += `</g>`;
    });

    const z = map(resolvePoint({ kind: "acquit", value: "Z" }, table));
    svg += `<circle cx="${z.x}" cy="${z.y}" r="5" fill="#fff" stroke="#2b2118" stroke-width="2"/><text x="${z.x+10}" y="${z.y+4}" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="#fff" stroke="#103d2c" stroke-width="3" paint-order="stroke fill">Z</text>`;
    if (!segments.length) svg += `<text x="${W/2}" y="${H/2}" text-anchor="middle" class="empty-note" font-family="system-ui,sans-serif" fill="#fff0bd">Vul V en A in om lijnen te tekenen</text>`;
    svg += `<text x="${W/2}" y="${H-18}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#6d5d4b">${segments.length === 7 ? "Volledige loop" : `${segments.length} van 7 lijnen volledig ingevuld`}</text></svg>`;
    el("svgMount").innerHTML = svg;
  }

  function drawDots(table, map) {
    let dots = `<g fill="#fff8dc" stroke="#3b291c" stroke-width=".7">`;
    let labels = `<g fill="#3b291c" font-family="system-ui,sans-serif" font-size="9" font-weight="700">`;
    ["west", "oost"].forEach(band => {
      for (let v = 0; v <= 80; v += 10) {
        const p = map(resolvePoint({ band, value: v }, table));
        dots += `<circle cx="${p.x}" cy="${p.y}" r="2.7"/>`;
        const tx = p.x + (band === "west" ? -8 : 8);
        labels += `<text x="${tx}" y="${p.y + 3}" text-anchor="${band === "west" ? "end" : "start"}">${v}</text>`;
      }
    });
    ["noord", "zuid"].forEach(band => {
      for (let v = 0; v <= 40; v += 10) {
        const p = map(resolvePoint({ band, value: v }, table));
        dots += `<circle cx="${p.x}" cy="${p.y}" r="2.7"/>`;
        labels += `<text x="${p.x}" y="${p.y + (band === "noord" ? -8 : 14)}" text-anchor="middle">${v}</text>`;
      }
    });
    return dots + `</g>` + labels + `</g>`;
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportSvg() {
    const svg = el("tableSvg");
    download(`TAFEL-${currentTable}-${currentPattern}.svg`, new XMLSerializer().serializeToString(svg), "image/svg+xml");
  }
  function exportJson() { download("TAFEL-lijnconfig.json", JSON.stringify(state, null, 2), "application/json"); }
  async function importJson(event) {
    const file = event.target.files[0]; if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (!imported?.data || (imported.version !== 1 && imported.version !== STATE_VERSION)) throw new Error("Onbekende configuratie-indeling");
      const migrated = migrateState(imported);
      state.version = STATE_VERSION; state.data = migrated.data; state.ui = migrated.ui || state.ui; normalizeState();
      currentTable = state.ui.table || "groot"; currentPattern = state.ui.pattern || "VIJF"; noseDirection = state.ui.noseDirection || "west";
      el("patternSelect").value = currentPattern; el("noseDirection").value = noseDirection;
      saveState(); render();
    } catch (error) { el("messages").textContent = `Import mislukt: ${error.message}`; }
    event.target.value = "";
  }
  function resetPattern() {
    if (!confirm(`${currentPattern} voor ${START.tables[currentTable].label} wissen?`)) return;
    state.data[currentTable][currentPattern] = blankPattern(noseDirection); saveState(); render();
  }

  init();
})();
