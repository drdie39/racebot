# Racebot iTelemetry Meatball + Long-Pit Watcher

## CURRENT STATUS
**Live iTelemetry integration: partially working (mocked by default).**

- Full app works end-to-end in demo mode using `MockITelemetryAdapter`.
- Live adapter boundaries are implemented, but stable legal endpoint mapping + user auth/session wiring is still required for production live feeds.

## Features
- Continuous session monitoring.
- Detect your car by car number or driver name (with alias map).
- Watch same-class competitors ahead of you.
- Alert on:
  - meatball flags (explicit preferred, inferred fallback),
  - pit stops longer than class norm (default: 15% over class average).
- Alert channels:
  - dashboard realtime updates (SSE),
  - terminal log,
  - Discord webhook or bot-token channel post.
- Duplicate alert suppression until condition clears.
- Alert history retention.

## One command
```bash
docker compose up --build
```
Open: http://localhost:3000

## Settings
Configure in UI `/settings` or file `config/user-config.json`.

Important fields:
- `sessionUrlOrId`
- `myDriverName` and/or `myCarNumber`
- `pollingIntervalMs`
- `pitStopThresholdPercent` (e.g., `15`)
- `minPitSamplesPerClass`
- Discord settings (`mode`, `roleId`, `webhookUrl` OR `botToken`+`channelId`)

Sample: `config/sample-config.json`

## Tests
```bash
npm test
```
Includes tests for:
- same-class ahead filtering,
- duplicate suppression,
- Discord message formatting,
- meatball detection,
- long pit-stop threshold detection.

## Technical design
See `docs/technical-design.md`.

## Remaining manual steps for live iTelemetry
1. Confirm legal read-only endpoints used by the authenticated web app.
2. Provide user-driven auth/session cookies/profile.
3. Map live payload fields to `SessionSnapshot` and `CarEntry` pit fields.
