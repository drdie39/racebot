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

## Meatball and long-pit detection
- **Meatball priority**:
  1. explicit race-control message match (`black/orange` or `meatball` + car number),
  2. inferred penalty/flag fields (`MEATBALL`/`TECHNICAL`).
- **Longer-than-usual pit stop**:
  - monitor only same-class cars ahead,
  - compute class average from `completedPitStopsSeconds`,
  - trigger when current pit stop (`currentPitStopSeconds`) is at least `pitStopThresholdPercent` above class average,
  - require at least `minPitSamplesPerClass` before triggering.

## Assumptions and limitations
- iTelemetry live integration is adapter-isolated; full live support depends on legal, stable, read-only endpoint access with user-provided auth.
- Playwright fallback requires user-driven login/session profile; no auth bypassing is implemented.
- Long-pit alerts rely on telemetry exposing pit duration fields; if unavailable, feature degrades without alerting.
