import { NextResponse } from 'next/server';
import { getConfig, setConfig } from '@/src/core/state/singleton';

export async function GET() {
  return NextResponse.json(getConfig());
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(setConfig(body));
}
