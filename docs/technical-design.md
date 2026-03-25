# Technical Design Note (2026-03-25)

## Integration approach chosen
1. **Official API check:** no public official iTelemetry API docs were found during initial review.
2. **Browser behavior check:** public session pages are visible in browser context (example session path `/session/<id>/stints`), but direct non-browser requests from CLI returned `403 Forbidden`.
3. **Safe/legal decision:** implement a pluggable adapter architecture with:
   - `MockITelemetryAdapter` (fully working for development/demo),
   - `LiveHttpITelemetryAdapter` (read-only endpoint adapter requiring user-supplied authenticated browser-session-compatible endpoint/cookies),
   - `PlaywrightITelemetryAdapter` placeholder for user-driven login automation when needed.

Because stable documented live endpoints were not confirmed in this environment, current default mode is **mocked adapter**.

## Required identifiers
- `sessionUrlOrId`: iTelemetry session URL or session identifier.
- `myDriverName` and/or `myCarNumber`: used to identify “my car”.
- `driverAliasMap`: resolves ambiguous team/driver swap entries.

## Same-class and ahead-of-me computation
- Identify my active entry by car number first, then driver name/aliases.
- Same class = `car.carClass === myCar.carClass`.
- Ahead of me = strictly better race position: `car.position < myCar.position`.
- In practice/qualifying, race-position logic is degraded and surfaced in UI.

## Meatball detection
Priority order:
1. **Explicit**: race-control messages containing the target car number + `black/orange` or `meatball`.
2. **Inferred (high confidence)**: flag/penalty fields indicate technical/meatball (`flags` includes `MEATBALL` or `penaltyStatus === TECHNICAL`).

Inferred alerts are labeled `confidence: inferred`.

## Assumptions and limitations
- iTelemetry live integration is adapter-isolated; full live support depends on legal, stable, read-only endpoint access with user-provided auth.
- Playwright fallback requires user-driven login/session profile; no auth bypassing is implemented.
- Discord bot slash command registration flow is documented but not auto-registered to avoid unintended app changes without app credentials.
