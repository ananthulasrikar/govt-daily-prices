const { parsePricesPage } = require('./parser');

const SOURCE_URL = process.env.PRICE_SOURCE_URL || 'https://fcainfoweb.nic.in/Reports/DB/Dailyprices.aspx';

async function getDailyPrices() {
  const response = await fetch(SOURCE_URL, {
    headers: {
      'User-Agent': 'govt-daily-prices-viewer/1.0'
    }
  });

  if (!response.ok) {
    const error = new Error('Unable to fetch source page');
    error.status = response.status;
    throw error;
  }

  const html = await response.text();

  return {
    sourceUrl: SOURCE_URL,
    fetchedAt: new Date().toISOString(),
    ...parsePricesPage(html)
  };
}

module.exports = {
  SOURCE_URL,
  getDailyPrices
};
