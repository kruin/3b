/* Actuele meeteditie; historische Kruinbasissen blijven zelfstandig bewaard. */
(() => {
  'use strict';
  const values = window.THREEB_KRUIN_VALUES;
  if (!values?.measurementTables) return;
  const revision = values.measurementRevision.slice(0, 12);
  const id = 'kruin-v208-meetprofielen-' + revision;
  window.THREEB_BASES.push({
    id,
    label: 'Kruin · ingespeeld / nieuw laken · meeteditie ' + revision,
    config: JSON.parse(JSON.stringify(window.THREEB_START_CONFIG)),
    values: JSON.parse(JSON.stringify(values))
  });
  window.THREEB_DEFAULT_BASIS = id;
})();
