'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [cfg, setCfg] = useState<any>();
  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setCfg);
  }, []);
  if (!cfg) return <p>Loading...</p>;

  const save = async () => {
    await fetch('/api/settings', { method: 'POST', body: JSON.stringify(cfg) });
    alert('saved');
  };

  return (
    <div>
      <h1>Settings</h1>
      <label>Session URL/ID <input value={cfg.sessionUrlOrId} onChange={(e) => setCfg({ ...cfg, sessionUrlOrId: e.target.value })} /></label><br />
      <label>My driver name <input value={cfg.myDriverName ?? ''} onChange={(e) => setCfg({ ...cfg, myDriverName: e.target.value })} /></label><br />
      <label>My car number <input value={cfg.myCarNumber ?? ''} onChange={(e) => setCfg({ ...cfg, myCarNumber: e.target.value })} /></label><br />
      <label>Polling ms <input type="number" value={cfg.pollingIntervalMs} onChange={(e) => setCfg({ ...cfg, pollingIntervalMs: Number(e.target.value) })} /></label><br />
      <label>Long pit threshold % <input type="number" value={cfg.pitStopThresholdPercent} onChange={(e) => setCfg({ ...cfg, pitStopThresholdPercent: Number(e.target.value) })} /></label><br />
      <label>Min pit samples/class <input type="number" value={cfg.minPitSamplesPerClass} onChange={(e) => setCfg({ ...cfg, minPitSamplesPerClass: Number(e.target.value) })} /></label><br />
      <label>Discord mode <select value={cfg.discord.mode} onChange={(e) => setCfg({ ...cfg, discord: { ...cfg.discord, mode: e.target.value } })}><option>none</option><option>webhook</option><option>bot</option></select></label><br />
      <label>Discord webhook <input value={cfg.discord.webhookUrl ?? ''} onChange={(e) => setCfg({ ...cfg, discord: { ...cfg.discord, webhookUrl: e.target.value } })} /></label><br />
      <label>Discord bot token <input value={cfg.discord.botToken ?? ''} onChange={(e) => setCfg({ ...cfg, discord: { ...cfg.discord, botToken: e.target.value } })} /></label><br />
      <label>Discord channel id <input value={cfg.discord.channelId ?? ''} onChange={(e) => setCfg({ ...cfg, discord: { ...cfg.discord, channelId: e.target.value } })} /></label><br />
      <label>Role ID <input value={cfg.discord.roleId ?? ''} onChange={(e) => setCfg({ ...cfg, discord: { ...cfg.discord, roleId: e.target.value } })} /></label><br />
      <button onClick={save}>Save</button>
    </div>
  );
}
