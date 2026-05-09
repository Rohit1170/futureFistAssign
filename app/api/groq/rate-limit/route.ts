import { NextResponse } from 'next/server';
import { getLastRateLimitInfo } from '@/services/toolOrchestrator';

export const dynamic = 'force-dynamic';

export async function GET() {
  const info = getLastRateLimitInfo();
  return NextResponse.json(info);
}
