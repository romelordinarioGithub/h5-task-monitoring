# Collaborator Handoff

## What this project is

This is the Mantine frontend for the AdWeave Monitoring Dashboard.

The current version is frontend-first and uses mock data stored in `src/App.jsx`.

## Main areas in the UI

- `Task Type Summary`
- `Ticket Closed`
- `Recent Activity`
- `Task View`
- `Selected Task Detail`
- `Available Dev Resource`

## Current mock-data areas

Inside `src/App.jsx`, the main mock collections are:

- `taskTypes`
- `tasks`
- `recentActivities`
- `devResources`
- `teams`

## Likely backend integration points

These are the most likely data groups to replace with backend data:

### Tasks

A task currently uses fields like:

- `name`
- `type`
- `channel`
- `health`
- `status`
- `priority`
- `assignees`

### Recent activity

- `task`
- `fromStatus`
- `toStatus`
- `actor`
- `time`

### Dev resources

- `name`
- `team`
- `capacity`
- `skill`
- `status`
- `utilization`
- `trend`

## Important existing frontend behavior

- Clicking a task type card filters `Task View`
- `Task View` supports filtering by:
  - task name
  - channel
  - health
  - status
  - priority
  - assigned dev
- Clicking a task row updates `Selected Task Detail`
- Team Capacity is scrollable internally so the page height stays stable
- Night mode is available from the top hero section

## Suggested next technical step

Instead of mixing fetch logic directly into the whole page, a clean next step would be:

1. move mock data into a separate file like `src/mockData.js`
2. replace that with a service or fetch layer later
3. keep the UI components consuming the same data shape

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
