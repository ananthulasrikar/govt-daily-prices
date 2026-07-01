const test = require('node:test');
const assert = require('node:assert/strict');
const { parsePricesPage } = require('../src/parser');

test('parsePricesPage extracts headers and row objects', () => {
  const html = `
    <html><body>
      <table>
        <tr><th>Commodity</th><th>Price</th><th>Unit</th></tr>
        <tr><td>Rice</td><td>42</td><td>kg</td></tr>
        <tr><td>Wheat</td><td>30</td><td>kg</td></tr>
      </table>
    </body></html>
  `;

  const result = parsePricesPage(html);

  assert.deepEqual(result.headers, ['Commodity', 'Price', 'Unit']);
  assert.deepEqual(result.rows, [
    { Commodity: 'Rice', Price: '42', Unit: 'kg' },
    { Commodity: 'Wheat', Price: '30', Unit: 'kg' }
  ]);
});

test('parsePricesPage handles tables without explicit header cells', () => {
  const html = `
    <table>
      <tr><td>State</td><td>Value</td></tr>
      <tr><td>Karnataka</td><td>98</td></tr>
    </table>
  `;

  const result = parsePricesPage(html);

  assert.deepEqual(result.headers, ['State', 'Value']);
  assert.deepEqual(result.rows, [
    { State: 'State', Value: 'Value' },
    { State: 'Karnataka', Value: '98' }
  ]);
});
