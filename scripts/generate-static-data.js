const fs = require('node:fs/promises');
const path = require('node:path');
const { getDailyPrices } = require('../src/prices');

async function main() {
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  const outputPath = path.join(outputDir, 'daily-prices.json');
  const payload = await getDailyPrices();

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
