const table = document.getElementById('pricesTable');
const statusText = document.getElementById('status');
const emptyState = document.getElementById('emptyState');
const refreshButton = document.getElementById('refresh');

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderTable(headers, rows) {
  if (!headers.length || !rows.length) {
    table.hidden = true;
    emptyState.hidden = false;
    return;
  }

  const head = `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows
    .map(
      (row) =>
        `<tr>${headers
          .map((header) => `<td>${escapeHtml(String(row[header] ?? ''))}</td>`)
          .join('')}</tr>`
    )
    .join('')}</tbody>`;

  table.innerHTML = head + body;
  table.hidden = false;
  emptyState.hidden = true;
}

async function loadData() {
  statusText.textContent = 'Refreshing data...';

  try {
    const response = await fetch('/api/daily-prices', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Source fetch failed with status ${response.status}`);
    }

    const payload = await response.json();
    renderTable(payload.headers || [], payload.rows || []);

    const fetched = payload.fetchedAt ? new Date(payload.fetchedAt).toLocaleString() : 'just now';
    statusText.textContent = `Last updated: ${fetched}. Auto-refresh runs every 24 hours.`;
  } catch (error) {
    table.hidden = true;
    emptyState.hidden = false;
    emptyState.textContent = 'Unable to load data right now. Please try again shortly.';
    statusText.textContent = error.message;
  }
}

refreshButton.addEventListener('click', loadData);
loadData();
setInterval(loadData, DAY_IN_MS);
