const test = require('node:test');
const assert = require('node:assert/strict');
const { getDailyPrices, SOURCE_URL } = require('../src/prices');

test('getDailyPrices fetches and parses the configured source page', { concurrency: false }, async () => {
  const originalFetch = global.fetch;
  const originalSourceUrl = process.env.PRICE_SOURCE_URL;

  try {
    process.env.PRICE_SOURCE_URL = 'https://example.com/prices';
    delete require.cache[require.resolve('../src/prices')];
    const { getDailyPrices: getConfiguredDailyPrices } = require('../src/prices');

    global.fetch = async (url, options) => {
      assert.equal(url, 'https://example.com/prices');
      assert.equal(options.headers['User-Agent'], 'govt-daily-prices-viewer/1.0');

      return {
        ok: true,
        text: async () => `
          <table>
            <tr><th>Commodity</th><th>Price</th></tr>
            <tr><td>Rice</td><td>42</td></tr>
          </table>
        `
      };
    };

    const result = await getConfiguredDailyPrices();

    assert.equal(result.sourceUrl, 'https://example.com/prices');
    assert.deepEqual(result.headers, ['Commodity', 'Price']);
    assert.deepEqual(result.rows, [{ Commodity: 'Rice', Price: '42' }]);
    assert.match(result.fetchedAt, /\d{4}-\d{2}-\d{2}T/);
  } finally {
    global.fetch = originalFetch;

    if (originalSourceUrl === undefined) {
      delete process.env.PRICE_SOURCE_URL;
    } else {
      process.env.PRICE_SOURCE_URL = originalSourceUrl;
    }

    delete require.cache[require.resolve('../src/prices')];
  }
});

test('getDailyPrices surfaces upstream status failures', { concurrency: false }, async () => {
  const originalFetch = global.fetch;

  try {
    global.fetch = async () => ({
      ok: false,
      status: 503
    });

    await assert.rejects(getDailyPrices(), (error) => {
      assert.equal(error.message, 'Unable to fetch source page');
      assert.equal(error.status, 503);
      assert.equal(SOURCE_URL, 'https://fcainfoweb.nic.in/Reports/DB/Dailyprices.aspx');
      return true;
    });
  } finally {
    global.fetch = originalFetch;
  }
});
