'use client';

import { useEffect, useState } from 'react';

type State = any;

export function Dashboard() {
  const [state, setState] = useState<State>();

  const refresh = async () => setState(await (await fetch('/api/state')).json());

  useEffect(() => {
    refresh();
    const ev = new EventSource('/api/events');
    ev.onmessage = (m) => setState(JSON.parse(m.data));
    return () => ev.close();
  }, []);

  const action = async (command: 'start' | 'stop') => {
    await fetch('/api/watch', { method: 'POST', body: JSON.stringify({ command }) });
    await refresh();
  };

  return (
    <div>
      <h1>Racebot Alerts Dashboard</h1>
      <p>Status: {state?.running ? 'Running' : 'Stopped'}</p>
      <p>Session: {state?.sessionName ?? 'n/a'} ({state?.sessionType ?? 'unknown'})</p>
      <p>My car: {state?.myCar ? `#${state.myCar.carNumber} ${state.myCar.driverName} (${state.myCar.carClass})` : 'not found'}</p>
      <p>Integration health: {state?.integrationHealth}</p>
      <p>{state?.message}</p>
      <button onClick={() => action('start')}>Start</button>
      <button onClick={() => action('stop')}>Stop</button>
      <h2>Same-class ahead</h2>
      <ul>{(state?.sameClassAhead ?? []).map((c: any) => <li key={c.id}>P{c.position} #{c.carNumber} {c.driverName}</li>)}</ul>
      <h2>Recent alerts</h2>
      <ul>{(state?.alerts ?? []).slice(0, 10).map((a: any) => <li key={a.key+a.timestamp}>{a.timestamp} - {a.message} ({a.confidence})</li>)}</ul>
      <a href="/settings">Settings</a>
    </div>
  );
}
