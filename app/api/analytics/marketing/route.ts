import { NextResponse } from 'next/server';
import MarketingSpend from '@/models/MarketingSpend';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();

    const spends = await MarketingSpend.find().select('channel spendAmount conversions impressions');

    const channels: Record<string, { spend: number; conversions: number; impressions: number }> = {};

    for (const s of spends) {
      if (!channels[s.channel]) {
        channels[s.channel] = { spend: 0, conversions: 0, impressions: 0 };
      }
      channels[s.channel].spend += s.spendAmount;
      channels[s.channel].conversions += s.conversions;
      channels[s.channel].impressions += s.impressions;
    }

    const data = Object.entries(channels).map(([name, v]) => ({
      name,
      spend: Math.round(v.spend / 1_000),
      conversions: v.conversions,
      roi: v.spend > 0 ? parseFloat(((v.conversions / v.spend) * 100000).toFixed(1)) : 0,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('[analytics/marketing] error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
