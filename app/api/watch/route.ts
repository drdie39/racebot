import { NextResponse } from 'next/server';
import { getMonitor } from '@/src/core/state/singleton';

export async function POST(req: Request) {
  const { command } = await req.json();
  const monitor = getMonitor();
  if (command === 'start') await monitor.start();
  if (command === 'stop') await monitor.stop();
  return NextResponse.json(monitor.getState());
}
