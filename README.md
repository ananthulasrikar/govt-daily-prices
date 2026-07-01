# govt-daily-prices

Simple Node.js app that fetches daily prices from:
`https://fcainfoweb.nic.in/Reports/DB/Dailyprices.aspx`
and renders them in a cleaner web UI.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Behavior

- Uses `/api/daily-prices` to fetch latest data from the source page.
- Shows the values in a readable, scrollable table UI.
- Auto-refreshes every 24 hours and supports manual refresh.
