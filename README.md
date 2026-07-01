# govt-daily-prices

Simple Node.js app that fetches daily prices from:
`https://fcainfoweb.nic.in/Reports/DB/Dailyprices.aspx`
and renders them in a cleaner web UI.

Published site: https://ananthulasrikar.github.io/govt-daily-prices/

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## GitHub Pages

- The repository publishes a static snapshot to GitHub Pages.
- Deployments run on every push, on manual dispatch, and once per day to refresh the published data.
- The published site reads from `public/data/daily-prices.json`, while local development falls back to `./api/daily-prices`.

## Behavior

- Uses `/api/daily-prices` to fetch latest data from the source page.
- Shows the values in a readable, scrollable table UI.
- Auto-refreshes every 24 hours and supports manual refresh.
