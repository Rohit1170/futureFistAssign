import Movie from '@/models/Movie';
import WatchActivity from '@/models/WatchActivity';
import connectDB from '@/lib/mongodb';

export async function queryMoviePerformance(params: {
  title?: string;
  genre?: string;
  limit?: number;
}) {
  try {
    await connectDB();

    const query: any = {};
    if (params.title) {
      query.title = { $regex: params.title, $options: 'i' };
    }
    if (params.genre) {
      query.genre = params.genre;
    }

    const movies = await Movie.find(query)
      .sort({ revenue: -1 })
      .limit(params.limit || 10);

    return {
      success: true,
      data: movies.map((m) => ({
        title: m.title,
        genre: m.genre,
        viewers: m.viewers,
        revenue: m.revenue,
        rating: m.rating,
        marketingSpend: m.marketingSpend,
      })),
    };
  } catch (error) {
    console.error('[v0] queryMoviePerformance error:', error);
    return { success: false, error: 'Failed to query movie performance' };
  }
}

export async function compareTitles(params: {
  titles: string[];
  metrics?: string[];
}) {
  try {
    await connectDB();

    const movies = await Movie.find({
      title: { $in: params.titles },
    });

    const comparison = movies.map((m) => ({
      title: m.title,
      viewers: m.viewers,
      revenue: m.revenue,
      rating: m.rating,
      marketingSpend: m.marketingSpend,
      roi: m.marketingSpend > 0 ? ((m.revenue / m.marketingSpend) * 100).toFixed(2) : 'N/A',
    }));

    return {
      success: true,
      data: comparison,
    };
  } catch (error) {
    console.error('[v0] compareTitles error:', error);
    return { success: false, error: 'Failed to compare titles' };
  }
}

export async function getMovieDetails(title: string) {
  try {
    await connectDB();

    const movie = await Movie.findOne({
      title: { $regex: title, $options: 'i' },
    });

    if (!movie) {
      return { success: false, error: `Movie "${title}" not found` };
    }

    const activities = await WatchActivity.find({ movieId: movie._id }).limit(100);

    const avgCompletion = activities.length > 0
      ? (activities.reduce((sum, a) => sum + a.completionRate, 0) / activities.length).toFixed(2)
      : 0;

    return {
      success: true,
      data: {
        ...movie.toObject(),
        avgCompletionRate: avgCompletion,
        recentActivityCount: activities.length,
      },
    };
  } catch (error) {
    console.error('[v0] getMovieDetails error:', error);
    return { success: false, error: 'Failed to get movie details' };
  }
}
