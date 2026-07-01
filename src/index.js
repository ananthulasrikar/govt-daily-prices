const express = require('express');
const path = require('path');
const { parsePricesPage } = require('./parser');

const SOURCE_URL = process.env.PRICE_SOURCE_URL || 'https://fcainfoweb.nic.in/Reports/DB/Dailyprices.aspx';
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/daily-prices', async (_req, res) => {
  try {
    const response = await fetch(SOURCE_URL, {
      headers: {
        'User-Agent': 'govt-daily-prices-viewer/1.0'
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        error: 'Unable to fetch source page',
        status: response.status
      });
    }

    const html = await response.text();
    const parsed = parsePricesPage(html);

    res.set('Cache-Control', 'no-store');
    return res.json({
      sourceUrl: SOURCE_URL,
      fetchedAt: new Date().toISOString(),
      ...parsed
    });
  } catch (error) {
    return res.status(502).json({
      error: 'Unable to fetch source page',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
