# AdWeave Monitoring Dashboard

This is a lightweight internal monitoring dashboard built with plain HTML, CSS, and JavaScript so your team can open it immediately without installing dependencies.

## Files

- `index.html` contains the dashboard structure.
- `styles.css` contains the visual design and responsive layout.
- `app.js` contains the sample monitoring data and rendering logic.

## How to use it

Open `index.html` in a browser to view the dashboard.

If you want to run it through a tiny local server instead, use:

```bash
./serve.sh
```

Then open `http://localhost:8000`.

You can also choose a different port:

```bash
./serve.sh 3000
```

## How to customize it

Edit the `dashboardData` object in `app.js` to replace the sample content with your real team data:

- `meta` for refresh time, on-call lead, and incident count
- `overview` for headline KPI cards
- `services` for service health
- `alerts` for active alerts
- `incidents` for ongoing incidents
- `watchlist` for cross-team risks
- `actions` for recommended next steps

## Good next upgrades

- Connect this to a real API or Google Sheet as a data source.
- Add auto-refresh for live monitoring.
- Add authentication if this will be hosted internally.
- Add charts for trend lines and historical incidents.
