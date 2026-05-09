import WatchActivity from '@/models/WatchActivity';
import MarketingSpend from '@/models/MarketingSpend';
import Viewer from '@/models/Viewer';
import connectDB from '@/lib/mongodb';

export async function getRegionalEngagement(params: {
  region?: string;
  timeframe?: string;
}) {
  try {
    await connectDB();

    const query: any = {};
    if (params.region) {
      query.region = params.region;
    }

    const activities = await WatchActivity.find(query).limit(1000);

    const regionStats: any = {};
    activities.forEach((activity) => {
      if (!regionStats[activity.region]) {
        regionStats[activity.region] = {
          region: activity.region,
          totalWatchTime: 0,
          avgCompletion: 0,
          avgEngagement: 0,
          count: 0,
        };
      }
      regionStats[activity.region].totalWatchTime += activity.watchTime;
      regionStats[activity.region].avgCompletion += activity.completionRate;
      regionStats[activity.region].avgEngagement += activity.engagementScore;
      regionStats[activity.region].count += 1;
    });

    // Calculate averages
    Object.keys(regionStats).forEach((region) => {
      const stats = regionStats[region];
      stats.avgCompletion = (stats.avgCompletion / stats.count).toFixed(2);
      stats.avgEngagement = (stats.avgEngagement / stats.count).toFixed(2);
    });

    return {
      success: true,
      data: Object.values(regionStats),
    };
  } catch (error) {
    console.error('[v0] getRegionalEngagement error:', error);
    return { success: false, error: 'Failed to get regional engagement' };
  }
}

export async function getViewerDemographics(params: {
  region?: string;
  ageGroup?: string;
}) {
  try {
    await connectDB();

    const query: any = {};
    if (params.region) {
      query.region = params.region;
    }
    if (params.ageGroup) {
      query.ageGroup = params.ageGroup;
    }

    const viewers = await Viewer.find(query);

    const demographics = {
      totalViewers: viewers.length,
      avgWatchCount: viewers.length > 0
        ? (viewers.reduce((sum, v) => sum + v.watchCount, 0) / viewers.length).toFixed(2)
        : 0,
      avgWatchTime: viewers.length > 0
        ? (viewers.reduce((sum, v) => sum + v.totalWatchTime, 0) / viewers.length).toFixed(2)
        : 0,
      subscriptionBreakdown: {
        free: viewers.filter((v) => v.subscriptionType === 'Free').length,
        premium: viewers.filter((v) => v.subscriptionType === 'Premium').length,
        premiumPlus: viewers.filter((v) => v.subscriptionType === 'Premium+').length,
      },
      viewers,
    };

    return {
      success: true,
      data: demographics,
    };
  } catch (error) {
    console.error('[v0] getViewerDemographics error:', error);
    return { success: false, error: 'Failed to get viewer demographics' };
  }
}

export async function getRegionalPerformance(movieId?: string) {
  try {
    await connectDB();

    const query: any = {};
    if (movieId) {
      query.movieId = movieId;
    }

    const spends = await MarketingSpend.find(query).limit(500);

    const regionPerf: any = {};
    spends.forEach((spend) => {
      const key = `${spend.region}-${spend.channel}`;
      if (!regionPerf[key]) {
        regionPerf[key] = {
          region: spend.region,
          channel: spend.channel,
          totalSpend: 0,
          totalImpressions: 0,
          totalConversions: 0,
        };
      }
      regionPerf[key].totalSpend += spend.spendAmount;
      regionPerf[key].totalImpressions += spend.impressions;
      regionPerf[key].totalConversions += spend.conversions;
    });

    // Calculate ROI
    Object.keys(regionPerf).forEach((key) => {
      const perf = regionPerf[key];
      perf.roi = perf.totalConversions > 0
        ? ((perf.totalConversions / perf.totalSpend) * 100).toFixed(4)
        : '0';
    });

    return {
      success: true,
      data: Object.values(regionPerf),
    };
  } catch (error) {
    console.error('[v0] getRegionalPerformance error:', error);
    return { success: false, error: 'Failed to get regional performance' };
  }
}
