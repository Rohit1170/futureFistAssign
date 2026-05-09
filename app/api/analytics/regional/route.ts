import { NextResponse } from 'next/server';
import WatchActivity from '@/models/WatchActivity';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();

    const activities = await WatchActivity.find().select('region completionRate engagementScore watchTime');

    const regions: Record<string, { completion: number; engagement: number; count: number }> = {};

    for (const a of activities) {
      if (!regions[a.region]) {
        regions[a.region] = { completion: 0, engagement: 0, count: 0 };
      }
      regions[a.region].completion += a.completionRate;
      regions[a.region].engagement += a.engagementScore;
      regions[a.region].count += 1;
    }

    const data = Object.entries(regions).map(([name, v]) => ({
      name,
      engagement: parseFloat((v.engagement / v.count).toFixed(1)),
      completion: parseFloat((v.completion / v.count).toFixed(1)),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('[analytics/regional] error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
