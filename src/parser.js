const cheerio = require('cheerio');

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function pickBestTable($) {
  let bestTable = null;
  let bestScore = 0;

  $('table').each((_, table) => {
    const rows = $(table).find('tr').length;
    const cols = Math.max(
      ...$(table)
        .find('tr')
        .map((__, row) => $(row).find('th,td').length)
        .get(),
      0
    );

    const score = rows * cols;
    if (score > bestScore) {
      bestScore = score;
      bestTable = table;
    }
  });

  return bestTable;
}

function parsePricesPage(html) {
  const $ = cheerio.load(html);
  const table = pickBestTable($);

  if (!table) {
    return { headers: [], rows: [] };
  }

  const tableRows = $(table).find('tr');
  if (!tableRows.length) {
    return { headers: [], rows: [] };
  }

  const firstRowCells = tableRows.first().find('th,td');
  const rawHeaders = firstRowCells
    .map((_, cell) => clean($(cell).text()))
    .get();

  let headers;
  if (!rawHeaders.some(Boolean)) {
    const columns = firstRowCells.length;
    headers = Array.from({ length: columns }, (_, idx) => `Column ${idx + 1}`);
  } else {
    headers = rawHeaders.map((header, index) => header || `Column ${index + 1}`);
  }

  const dataRows = tableRows.slice(1);

  const rows = dataRows
    .map((_, row) => {
      const cells = $(row)
        .find('td,th')
        .map((__, cell) => clean($(cell).text()))
        .get();

      if (!cells.some(Boolean)) {
        return null;
      }

      const record = {};
      headers.forEach((header, index) => {
        record[header] = cells[index] || '';
      });

      return record;
    })
    .get()
    .filter(Boolean);

  return { headers, rows };
}

module.exports = { parsePricesPage };
