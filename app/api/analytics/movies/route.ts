import { NextResponse } from 'next/server';
import Movie from '@/models/Movie';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();

    const movies = await Movie.find()
      .sort({ revenue: -1 })
      .limit(10)
      .select('title revenue viewers rating marketingSpend genre');

    const data = movies.map((m) => ({
      name: m.title.length > 16 ? m.title.slice(0, 16) + '…' : m.title,
      fullName: m.title,
      revenue: Math.round(m.revenue / 1_000_000),
      viewers: parseFloat((m.viewers / 1_000_000).toFixed(1)),
      rating: m.rating,
      marketingSpend: Math.round(m.marketingSpend / 1_000_000),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('[analytics/movies] error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
