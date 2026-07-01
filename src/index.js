const express = require('express');
const path = require('path');
const { getDailyPrices } = require('./prices');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/daily-prices', async (_req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    return res.json(await getDailyPrices());
  } catch (error) {
    const payload = {
      error: 'Unable to fetch source page',
      details: error.message
    };

    if (error.status) {
      payload.status = error.status;
    }

    return res.status(502).json(payload);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
