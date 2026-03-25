# Racebot iTelemetry Meatball Watcher

## CURRENT STATUS
**Live iTelemetry integration: partially working (mocked by default).**

- A complete full-stack app is implemented with adapter isolation.
- Default adapter is `MockITelemetryAdapter` for reliable local testing/demo.
- Live iTelemetry endpoint integration is scaffolded but requires user-provided legal/authenticated endpoint details and session configuration.

## What this app does
- Monitors a race session continuously.
- Finds your car by car number or driver name.
- Tracks same-class competitors ahead of you.
- Detects meatball flags (explicit first, inferred fallback).
- Sends alerts to:
  - UI dashboard (SSE realtime),
  - terminal logs,
  - Discord (webhook or bot token/channel mode).
- Suppresses duplicate alerts until the flag clears and appears again.
- Stores alert history.

## One-command start
```bash
docker compose up --build
```
Then open http://localhost:3000.

## Configuration
Use **Settings UI** or edit `config/user-config.json`.

Sample config: `config/sample-config.json`.

Required inputs:
- iTelemetry session URL/ID
- your driver name and/or car number
- polling interval

Optional:
- Discord role ID
- Discord webhook URL OR bot token + channel ID
- driver alias map for swaps/team entries

## Discord modes
- **Webhook mode**: fire-and-forget POST.
- **Bot mode**: uses Discord REST `Bot` auth for channel messages.
- Slash command set supported by app contract:
  - `/watch-session`
  - `/stop-watch`
  - `/status`
  - `/last-alerts`

## Development
```bash
npm install
npm run dev
```

## Tests
```bash
npm test
```

Covers:
- same-class filtering,
- ahead-of-me logic,
- duplicate suppression,
- Discord message formatting,
- explicit meatball detection.

## Integration notes
See: `docs/technical-design.md`.

## Final project tree
```text
.
├── Dockerfile
├── README.md
├── app/
│   ├── api/
│   │   ├── events/route.ts
│   │   ├── settings/route.ts
│   │   ├── state/route.ts
│   │   └── watch/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── settings/page.tsx
├── config/
│   └── sample-config.json
├── data/
│   └── mock-session.json
├── docker-compose.yml
├── docs/
│   └── technical-design.md
├── src/
│   ├── core/
│   │   ├── alerts/
│   │   ├── classification/
│   │   └── state/
│   ├── integrations/
│   │   ├── discord/
│   │   └── itelemetry/
│   ├── types.ts
│   └── ui/dashboard.tsx
└── tests/
    ├── classification.test.ts
    ├── deduper.test.ts
    ├── discord-format.test.ts
    └── meatball.test.ts
```

## Remaining manual steps for live iTelemetry
1. Capture/legal-verify browser-used read-only endpoint(s) for the target iTelemetry views.
2. Provide session auth in a user-driven way (normal login cookies/session profile).
3. Implement adapter mapping from endpoint payload -> `SessionSnapshot`.
4. Optionally enable Playwright fallback profile login flow.
