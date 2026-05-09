import { NextResponse } from 'next/server';
import QueryLog from '@/models/QueryLog';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();

    const logs = await QueryLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select('queryText toolsUsed response executionTime status createdAt');

    return NextResponse.json(logs);
  } catch (error) {
    console.error('[history] error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
