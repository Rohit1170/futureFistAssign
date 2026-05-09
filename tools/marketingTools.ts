import MarketingSpend from '@/models/MarketingSpend';
import Movie from '@/models/Movie';
import connectDB from '@/lib/mongodb';

export async function analyzeMarketingSpend(params: {
  movieTitle?: string;
  region?: string;
  channel?: string;
}) {
  try {
    await connectDB();

    let movieId: any = undefined;

    if (params.movieTitle) {
      const movie = await Movie.findOne({
        title: { $regex: params.movieTitle, $options: 'i' },
      });

      if (!movie) {
        return { success: false, error: `Movie "${params.movieTitle}" not found` };
      }
      movieId = movie._id;
    }

    const query: any = {};
    if (movieId) {
      query.movieId = movieId;
    }
    if (params.region) {
      query.region = params.region;
    }
    if (params.channel) {
      query.channel = params.channel;
    }

    const spends = await MarketingSpend.find(query).limit(500);

    const analysis = {
      totalSpend: spends.reduce((sum, s) => sum + s.spendAmount, 0),
      totalImpressions: spends.reduce((sum, s) => sum + s.impressions, 0),
      totalConversions: spends.reduce((sum, s) => sum + s.conversions, 0),
      avgCPC: 0,
      avgCPM: 0,
      conversionRate: 0,
      byChannel: {} as any,
      byRegion: {} as any,
    };

    if (analysis.totalImpressions > 0) {
      analysis.avgCPM = (analysis.totalSpend / (analysis.totalImpressions / 1000)).toFixed(2) as any;
    }

    if (analysis.totalConversions > 0) {
      analysis.avgCPC = (analysis.totalSpend / analysis.totalConversions).toFixed(2) as any;
      analysis.conversionRate = (
        (analysis.totalConversions / analysis.totalImpressions) *
        100
      ).toFixed(4) as any;
    }

    // Group by channel and region
    spends.forEach((spend) => {
      if (!analysis.byChannel[spend.channel]) {
        analysis.byChannel[spend.channel] = {
          spend: 0,
          conversions: 0,
        };
      }
      analysis.byChannel[spend.channel].spend += spend.spendAmount;
      analysis.byChannel[spend.channel].conversions += spend.conversions;

      if (!analysis.byRegion[spend.region]) {
        analysis.byRegion[spend.region] = {
          spend: 0,
          conversions: 0,
        };
      }
      analysis.byRegion[spend.region].spend += spend.spendAmount;
      analysis.byRegion[spend.region].conversions += spend.conversions;
    });

    return {
      success: true,
      data: analysis,
    };
  } catch (error) {
    console.error('[v0] analyzeMarketingSpend error:', error);
    return { success: false, error: 'Failed to analyze marketing spend' };
  }
}

export async function getChannelPerformance() {
  try {
    await connectDB();

    const spends = await MarketingSpend.find().limit(1000);

    const channels: any = {};

    spends.forEach((spend) => {
      if (!channels[spend.channel]) {
        channels[spend.channel] = {
          channel: spend.channel,
          totalSpend: 0,
          totalImpressions: 0,
          totalConversions: 0,
          campaigns: 0,
        };
      }
      channels[spend.channel].totalSpend += spend.spendAmount;
      channels[spend.channel].totalImpressions += spend.impressions;
      channels[spend.channel].totalConversions += spend.conversions;
      channels[spend.channel].campaigns += 1;
    });

    // Calculate metrics
    Object.keys(channels).forEach((channel) => {
      const ch = channels[channel];
      ch.cpM = ch.totalImpressions > 0 ? (ch.totalSpend / (ch.totalImpressions / 1000)).toFixed(2) : 'N/A';
      ch.conversionRate = ch.totalImpressions > 0
        ? ((ch.totalConversions / ch.totalImpressions) * 100).toFixed(4)
        : 'N/A';
    });

    return {
      success: true,
      data: Object.values(channels),
    };
  } catch (error) {
    console.error('[v0] getChannelPerformance error:', error);
    return { success: false, error: 'Failed to get channel performance' };
  }
}
