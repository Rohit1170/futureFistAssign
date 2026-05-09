import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Movie from '@/models/Movie';
import Viewer from '@/models/Viewer';
import WatchActivity from '@/models/WatchActivity';
import MarketingSpend from '@/models/MarketingSpend';

export async function POST(request: NextRequest) {
  try {
    // Verify admin role from headers
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can seed the database' },
        { status: 403 }
      );
    }

    console.log('[v0] Starting database seeding...');
    await connectDB();

    // Clear existing data
    console.log('[v0] Clearing existing data...');
    await Movie.deleteMany({});
    await Viewer.deleteMany({});
    await WatchActivity.deleteMany({});
    await MarketingSpend.deleteMany({});

    // Create movies
    console.log('[v0] Creating movies...');
    const movies = await Movie.insertMany([
      {
        title: 'Stellar Horizon',
        genre: ['Sci-Fi', 'Adventure'],
        releaseDate: new Date('2024-01-15'),
        director: 'James Chen',
        cast: ['Emma Watson', 'Tom Hardy', 'Zendaya'],
        description: 'A thrilling journey through space',
        viewers: 2500000,
        revenue: 425000000,
        marketingSpend: 75000000,
        rating: 8.5,
      },
      {
        title: 'Echoes of Tomorrow',
        genre: ['Drama', 'Thriller'],
        releaseDate: new Date('2024-02-10'),
        director: 'Sofia Reyes',
        cast: ['Oscar Isaac', 'Saoirse Ronan', 'Timothée Chalamet'],
        description: 'A mind-bending tale of time and memory',
        viewers: 1800000,
        revenue: 320000000,
        marketingSpend: 62000000,
        rating: 8.2,
      },
      {
        title: 'The Last Guardian',
        genre: ['Fantasy', 'Action'],
        releaseDate: new Date('2024-03-20'),
        director: 'Denis Villeneuve',
        cast: ['Henry Cavill', 'Gal Gadot', 'Jason Momoa'],
        description: 'An epic fantasy adventure',
        viewers: 3200000,
        revenue: 580000000,
        marketingSpend: 95000000,
        rating: 8.8,
      },
      {
        title: 'Midnight in Paris Redux',
        genre: ['Romance', 'Comedy'],
        releaseDate: new Date('2024-04-05'),
        director: 'Greta Gerwig',
        cast: ['Margot Robbie', 'Timothée Chalamet', 'Florence Pugh'],
        description: 'A romantic comedy across continents',
        viewers: 1200000,
        revenue: 245000000,
        marketingSpend: 48000000,
        rating: 7.9,
      },
      {
        title: 'Quantum Entanglement',
        genre: ['Sci-Fi', 'Mystery'],
        releaseDate: new Date('2024-05-12'),
        director: 'Christopher Nolan',
        cast: ['Robert Pattinson', 'Elizabeth Debicki', 'John David Washington'],
        description: 'A complex scientific thriller',
        viewers: 2100000,
        revenue: 380000000,
        marketingSpend: 70000000,
        rating: 8.4,
      },
    ]);

    console.log(`[v0] Created ${movies.length} movies`);

    // Create viewers by region
    console.log('[v0] Creating viewers...');
    const regions = ['North America', 'Europe', 'Asia', 'South America', 'Australia'];
    const ageGroups = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];
    const genres = ['Action', 'Drama', 'Sci-Fi', 'Romance', 'Thriller', 'Fantasy'];

    const viewers = [];
    for (const region of regions) {
      for (const ageGroup of ageGroups) {
        viewers.push({
          region,
          ageGroup,
          watchCount: Math.floor(Math.random() * 50) + 5,
          totalWatchTime: Math.floor(Math.random() * 2000) + 200,
          favoriteGenres: genres.sort(() => 0.5 - Math.random()).slice(0, 3),
          subscriptionType: ['Free', 'Premium', 'Premium+'][Math.floor(Math.random() * 3)],
        });
      }
    }

    const savedViewers = await Viewer.insertMany(viewers);
    console.log(`[v0] Created ${savedViewers.length} viewers`);

    // Create watch activities
    console.log('[v0] Creating watch activities...');
    const watchActivities = [];
    for (let i = 0; i < 500; i++) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      const viewer = savedViewers[Math.floor(Math.random() * savedViewers.length)];

      watchActivities.push({
        movieId: movie._id,
        viewerId: viewer._id,
        watchTime: Math.floor(Math.random() * 120) + 20,
        completionRate: Math.floor(Math.random() * 100),
        engagementScore: Math.floor(Math.random() * 100),
        region: viewer.region,
        deviceType: ['Mobile', 'Tablet', 'Desktop', 'Smart TV'][Math.floor(Math.random() * 4)],
        watchedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      });
    }

    await WatchActivity.insertMany(watchActivities);
    console.log(`[v0] Created ${watchActivities.length} watch activities`);

    // Create marketing spend records
    console.log('[v0] Creating marketing spend records...');
    const channels = ['TV', 'Digital', 'Print', 'Outdoor'];
    const marketingSpends = [];

    for (const movie of movies) {
      for (const region of regions) {
        for (const channel of channels) {
          for (let month = 0; month < 3; month++) {
            marketingSpends.push({
              movieId: movie._id,
              region,
              channel,
              spendAmount: Math.floor(Math.random() * 5000000) + 500000,
              impressions: Math.floor(Math.random() * 50000000) + 5000000,
              conversions: Math.floor(Math.random() * 500000) + 50000,
              date: new Date(Date.now() - month * 30 * 24 * 60 * 60 * 1000),
            });
          }
        }
      }
    }

    await MarketingSpend.insertMany(marketingSpends);
    console.log(`[v0] Created ${marketingSpends.length} marketing spend records`);

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully',
        stats: {
          movies: movies.length,
          viewers: savedViewers.length,
          watchActivities: watchActivities.length,
          marketingSpends: marketingSpends.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
