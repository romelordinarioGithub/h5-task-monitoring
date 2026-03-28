# AdWeave Monitoring Dashboard

This is the React + Vite + Mantine version of the internal AdWeave monitoring dashboard.

## Stack

- React
- Vite
- Mantine
- Tabler Icons

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in Terminal, usually:

```bash
http://localhost:5173
```

## Build

```bash
npm run build
```

## Project structure

- `src/App.jsx`: main dashboard UI and mock data
- `src/App.css`: dashboard-specific styling
- `src/index.css`: app-level base styles
- `src/main.jsx`: Mantine app bootstrap

## Current frontend status

- The UI is built and interactive.
- The dashboard currently uses mock data in `src/App.jsx`.
- Task filters, task-type click filtering, selected task view, recent activity, and team capacity widgets are already implemented.

## For backend integration

Your collaborator will most likely replace the mock data in `src/App.jsx` with:

- API calls
- shared backend response objects
- loading and error states

See [`COLLABORATOR_HANDOFF.md`](/Users/romelordinario/Documents/2026/adweave-monitoring-dashboard/mantine-dashboard/COLLABORATOR_HANDOFF.md) for the quick handoff notes.

## Notes

- This folder is the version intended for ongoing work.
- The older plain HTML/CSS/JS version still exists one level up in the project root.
