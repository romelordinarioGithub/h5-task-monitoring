# AdWeave Monitoring Dashboard

This repository now uses the React + Vite + Mantine app inside [`mantine-dashboard`](./mantine-dashboard) as the primary frontend.

## Current app

Work in:

- [`mantine-dashboard`](./mantine-dashboard)

Key files:

- [`mantine-dashboard/src/App.tsx`](./mantine-dashboard/src/App.tsx)
- [`mantine-dashboard/src/App.css`](./mantine-dashboard/src/App.css)
- [`mantine-dashboard/src/index.css`](./mantine-dashboard/src/index.css)
- [`mantine-dashboard/src/main.tsx`](./mantine-dashboard/src/main.tsx)

## Run locally

```bash
cd mantine-dashboard
npm install
npm run dev
```

Then open the Vite URL shown in Terminal, usually:

```bash
http://localhost:5173
```

## Deploy

This repository is configured for GitHub Pages.

After pushing to `main`, GitHub Actions deploys the built site. The live URL is:

```bash
https://romelordinarioGithub.github.io/h5-task-monitoring/
```

## Collaboration

For handoff details, see:

- [`mantine-dashboard/README.md`](./mantine-dashboard/README.md)
- [`mantine-dashboard/COLLABORATOR_HANDOFF.md`](./mantine-dashboard/COLLABORATOR_HANDOFF.md)
