import { NextResponse } from 'next/server';
import Movie from '@/models/Movie';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const [aggregate] = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          totalViewers: { $sum: '$viewers' },
          totalRevenue: { $sum: '$revenue' },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    if (!aggregate) {
      return NextResponse.json({
        totalMovies: 0, totalViewers: 0, totalRevenue: 0, avgRating: 0,
        trends: { movies: null, viewers: null, revenue: null, rating: null },
      });
    }

    // Year-over-year comparison using AVERAGES (not sums) to avoid
    // "more movies in one year = higher total" distortion.
    const thisYear = new Date().getFullYear();
    const thisYearStart = new Date(thisYear, 0, 1);
    const lastYearStart = new Date(thisYear - 1, 0, 1);

    const [thisYearData] = await Movie.aggregate([
      { $match: { releaseDate: { $gte: thisYearStart } } },
      {
        $group: {
          _id: null,
          avgViewers: { $avg: '$viewers' },
          avgRevenue: { $avg: '$revenue' },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const [lastYearData] = await Movie.aggregate([
      { $match: { releaseDate: { $gte: lastYearStart, $lt: thisYearStart } } },
      {
        $group: {
          _id: null,
          avgViewers: { $avg: '$viewers' },
          avgRevenue: { $avg: '$revenue' },
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    const pct = (current: number, previous: number): string | null => {
      if (!previous || !current) return null;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const hasBoth = thisYearData && lastYearData;

    return NextResponse.json({
      totalMovies: aggregate.totalMovies,
      totalViewers: aggregate.totalViewers,
      totalRevenue: aggregate.totalRevenue,
      avgRating: parseFloat(aggregate.avgRating.toFixed(1)),
      trends: {
        movies: hasBoth ? pct(thisYearData.count, lastYearData.count) : null,
        viewers: hasBoth ? pct(thisYearData.avgViewers, lastYearData.avgViewers) : null,
        revenue: hasBoth ? pct(thisYearData.avgRevenue, lastYearData.avgRevenue) : null,
        rating: hasBoth ? pct(thisYearData.avgRating, lastYearData.avgRating) : null,
      },
    });
  } catch (error) {
    console.error('[dashboard/stats] error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
