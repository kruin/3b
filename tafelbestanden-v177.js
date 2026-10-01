/* Zelfstandige tafelbestanden: basis, alle afwijkingen en exacte schermstand. */
window.ThreeBFiles = (() => {
  'use strict';
  const clone = x => JSON.parse(JSON.stringify(x));
  const forbidden = new Set(['__proto__', 'constructor', 'prototype']);
  const header = ['Soort', 'Pad', 'Type', 'Waarde', 'Basis'];
  let sql;
  const SQL = () => sql ??= window.initSqlJs();
  function differences(before, after, path = [], output = []) {
    if (JSON.stringify(before) === JSON.stringify(after)) return output;
    if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
      for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) differences(before[key], after[key], [...path, key], output);
    } else output.push([JSON.stringify(path), after === undefined ? 'verwijderd' : typeof after === 'number' ? 'getal' : 'json', after === undefined ? '' : typeof after === 'number' ? after : JSON.stringify(after), before === undefined ? '' : JSON.stringify(before)]);
    return output;
  }
  function tracked(state) {
    return Object.fromEntries(['data','variantData','departurePositions','strokeLengthsCm','bandOverrides'].map(key => [key, clone(state[key] || {})]));
  }
  function rows(payload) {
    const text = JSON.stringify(payload), result = [header];
    for (let i = 0; i < text.length; i += 28000) result.push(['Tafelbestand', String(i / 28000), 'json-deel', text.slice(i, i + 28000), '']);
    for (const row of differences(payload.basis.baseline, tracked(payload.state))) result.push(['Aanpassing', ...row]);
    for(const [key,note] of Object.entries(payload.state.coursePractice||{})) for(const [index,value] of (note.attempts||[]).entries()) if(value!==null) result.push(['Lesnotitie',JSON.stringify(['coursePractice',key,'attempts',String(index)]),'getal',value,`V ${note.from?.band} ${note.from?.value} → A ${note.band}`]);
    return result;
  }
  function validate(payload) {
    if (payload?.format !== '3B-tafel' || payload.version !== 1 || !payload.basis?.id || !payload.basis.config?.tables || !payload.basis.values?.tracks || !payload.state?.data || typeof payload.tableName !== 'string') throw Error('Dit is geen geldig 3B-tafelbestand.');
    const visit = (value, depth = 0) => {
      if (depth > 60) throw Error('Het tafelbestand is te diep genest.');
      if (typeof value === 'number' && !Number.isFinite(value)) throw Error('Ongeldige getalwaarde.');
      if (value && typeof value === 'object') for (const key of Object.keys(value)) {
        if (forbidden.has(key)) throw Error('Ongeldig veld in het tafelbestand.');
        visit(value[key], depth + 1);
      }
    };
    visit(payload);
    for (const table of ['groot','klein']) {
      if (!payload.state.data[table]) throw Error('Groot of Klein ontbreekt.');
      for (const route of Object.values(payload.state.data[table])) for (const line of Object.values(route)) {
        if (!line?.from || !line?.to) throw Error('Onvolledige lijn in het tafelbestand.');
        for (const point of [line.from, line.to]) {
          if (point.kind === 'acquit') continue;
          if (!['west','noord','oost','zuid'].includes(point.band) || !(point.value === null || typeof point.value === 'number' && Number.isFinite(point.value))) throw Error('Ongeldige band of stipwaarde.');
        }
      }
    }
    return payload;
  }
  function fromRows(input) {
    if (JSON.stringify(input[0]?.slice(0,5)) !== JSON.stringify(header)) throw Error('De 3B-kolommen ontbreken.');
    const chunks = input.slice(1).filter(row => row[0] === 'Tafelbestand').sort((a,b) => Number(a[1])-Number(b[1]));
    if (!chunks.length || chunks.some((row,i) => Number(row[1]) !== i)) throw Error('De oorspronkelijke tafelbasis is onvolledig.');
    const payload = JSON.parse(chunks.map(row => row[3]).join(''));
    validate(payload);
    for (const row of input.slice(1).filter(row => ['Aanpassing','Lesnotitie'].includes(row[0]))) {
      const path = JSON.parse(row[1]);
      if (!Array.isArray(path) || !path.length || !['data','variantData','departurePositions','strokeLengthsCm','bandOverrides','coursePractice'].includes(path[0]) || path.some(key => typeof key !== 'string' || forbidden.has(key))) throw Error('Ongeldig pad bij een aanpassing.');
      let target = payload.state;
      for (const key of path.slice(0,-1)) { if (!target[key] || typeof target[key] !== 'object') target[key] = {}; target = target[key]; }
      const key = path.at(-1),oldValue=target[key];
      if (row[2] === 'verwijderd') delete target[key];
      else if (row[2] === 'getal') { if (row[3] === '' || !Number.isFinite(Number(row[3]))) throw Error('Een aangepaste waarde is geen getal.'); target[key] = Number(row[3]); }
      else if (row[2] === 'json') target[key] = JSON.parse(row[3]);
      else throw Error('Onbekend waardetype.');
      if(row[0]==='Lesnotitie' && oldValue!==target[key] && payload.state.coursePractice?.[path[1]])payload.state.coursePractice[path[1]].complete=false;
    }
    return validate(payload);
  }
  async function encode(payload, format) {
    validate(payload);
    const data = rows(payload);
    if (format === 'sqlite3') {
      const engine = await SQL(), db = new engine.Database();
      try {
        db.run('CREATE TABLE tafelbestand(soort TEXT, pad TEXT, type TEXT, waarde, basis TEXT)');
        db.run('BEGIN');
        for (const row of data.slice(1)) db.run('INSERT INTO tafelbestand VALUES(?,?,?,?,?)', row);
        db.run('COMMIT');
        return db.export();
      } finally { db.close(); }
    }
    const sheet = window.XLSX.utils.aoa_to_sheet(data);
    sheet['!cols'] = [{wch:17},{wch:66},{wch:15},{wch:28},{wch:28}];
    if (format === 'csv') return '\ufeff' + data.map(row => row.map(value => '"' + String(value ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
    if (!['xlsx','ods'].includes(format)) throw Error('Onbekend bestandsformaat.');
    const book = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(book, sheet, 'Aanpassingen');
    window.XLSX.utils.book_append_sheet(book, window.XLSX.utils.aoa_to_sheet([
      ['3B tafelbestand', ''], ['Tafelnaam (optioneel)', payload.tableName], ['Kruinbasis',payload.basis.id], ['Basisnaam',payload.basis.label],
      ['Appversie',177], ['Groot en Klein','Apart bewaard'], ['Terugladen','Gebruik Menu > Instellingen > Mijn tafel > Terugladen.'],
      ['Bewerken','Bij Aanpassing: getal = numeriek; json = JSON-waarde. Bewaar de Tafelbestand-regels.']
    ]), 'Toelichting');
    return window.XLSX.write(book, {bookType:format,type:'array'});
  }
  async function decode(bytes, filename) {
    const format = filename.split('.').at(-1).toLowerCase();
    let data;
    if (['sqlite','sqlite3','db'].includes(format)) {
      const engine = await SQL(), db = new engine.Database(new Uint8Array(bytes));
      try { const result = db.exec('SELECT soort,pad,type,waarde,basis FROM tafelbestand ORDER BY rowid'); data = [header,...(result[0]?.values || [])]; } finally { db.close(); }
    } else {
      if (!['xlsx','ods','csv'].includes(format)) throw Error('Kies XLSX, ODS, SQLite of CSV.');
      const source = format === 'csv' ? new TextDecoder().decode(bytes).replace(/^\ufeff/,'') : bytes;
      const book = window.XLSX.read(source, {type:format === 'csv'?'string':'array',raw:format === 'csv', cellFormula:false});
      data = window.XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], {header:1,defval:'',raw:true});
    }
    return fromRows(data);
  }
  function filename(payload, format) {
    const slug = (payload.tableName || 'mijn-tafel').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').slice(0,60) || 'mijn-tafel';
    return `3B-${slug}--${payload.basis.id}--app-v177.${format}`;
  }
  return {encode, decode, rows, fromRows, differences, tracked, validate, filename};
})();
