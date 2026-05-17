# Video Game Olympics

Live scoreboard for https://alaynatruttmann.com/video-game-olympics/.

## Setup

This app runs on Node 22 and Yarn.

```sh
yarn install
cp .env.example .env.local
```

Set `VITE_EVENT_PASSWORD` in `.env.local` if the pre-event gate should require a password. Vite embeds this value in the static JavaScript bundle, so it is only useful as a lightweight event gate and not real access control.

## Scripts

```sh
yarn dev
yarn build
yarn preview
yarn typecheck
```

`yarn dev` starts Vite locally at http://localhost:5173.

## Spreadsheet Data

The scoreboard reads a public Google Spreadsheet by sheet name:

- `Leaderboard`
- `Challenges`
- `Post-Game Achievements`
- `Times`

The `Times` sheet should include `Start` and `End` columns with Unix timestamps in seconds. The spreadsheet must stay viewable by anyone with the link. The app reads the public Google Visualization response by sheet name and does not use a Google service-account key.

## Deployment

Pushes to `main` deploy to GitHub Pages through `.github/workflows/deploy.yml`.

In the repository settings, set Pages to deploy from GitHub Actions. If the event gate should be enabled in production, add a repository secret named `VITE_EVENT_PASSWORD`; the workflow passes it to the Vite build.
