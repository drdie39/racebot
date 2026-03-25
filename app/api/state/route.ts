import { NextResponse } from 'next/server';
import { getMonitor } from '@/src/core/state/singleton';

export async function GET() {
  return NextResponse.json(getMonitor().getState());
}
