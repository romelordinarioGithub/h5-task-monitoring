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

## Test the login screen again

The current login flow is frontend-only and stores the signed-in email in `localStorage`.

If you want to see the login screen again after refreshing, open the browser console and run:

```js
localStorage.removeItem('adweave-auth-email')
location.reload()
```

You can also remove `adweave-auth-email` manually from the browser's local storage for the site.

After logging in again, the `Task View` height should now recalculate immediately without needing a manual browser refresh.

## Deploy to GitHub Pages

This project is configured for GitHub Pages deployment for the repository:

```bash
h5-task-monitoring
```

After pushing to `main`, enable GitHub Pages in the repository settings:

1. Open the GitHub repository
2. Go to `Settings`
3. Go to `Pages`
4. Under `Build and deployment`, choose `GitHub Actions`

After the workflow finishes, the site will be available at:

```bash
https://romelordinarioGithub.github.io/h5-task-monitoring/
```

## Project structure

- `src/App.tsx`: main dashboard UI and mock data
- `src/App.css`: dashboard-specific styling
- `src/index.css`: app-level base styles
- `src/main.tsx`: Mantine app bootstrap

## Current frontend status

- The UI is built and interactive.
- The dashboard currently uses mock data in `src/App.tsx`.
- Task filters, task-type click filtering, selected task view, recent activity, and team capacity widgets are already implemented.

## For backend integration

Your collaborator will most likely replace the mock data in `src/App.tsx` with:

- API calls
- shared backend response objects
- loading and error states

See [`COLLABORATOR_HANDOFF.md`](/Users/romelordinario/Documents/2026/adweave-monitoring-dashboard/mantine-dashboard/COLLABORATOR_HANDOFF.md) for the quick handoff notes.

## Notes

- This folder is the version intended for ongoing work.
- The older plain HTML/CSS/JS version still exists one level up in the project root.
