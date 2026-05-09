import "dotenv/config";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Movie from "@/models/Movie";
import Viewer from "@/models/Viewer";
import WatchActivity from "@/models/WatchActivity";
import MarketingSpend from "@/models/MarketingSpend";

async function seed() {
  try {
    console.log("[v0] Connecting to database...");
    await connectDB();

    // Clear existing data
    console.log("[v0] Clearing existing data...");
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Viewer.deleteMany({});
    await WatchActivity.deleteMany({});
    await MarketingSpend.deleteMany({});

    // Create demo users
    console.log("[v0] Creating demo users...");
    const adminUser = new User({
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    const analystUser = new User({
      email: "analyst@example.com",
      password: "analyst123",
      role: "analyst",
    });

    await adminUser.save();
    await analystUser.save();

    console.log("[v0] Created users:");
    console.log("  - admin@example.com (admin)");
    console.log("  - analyst@example.com (analyst)");

    // Create movies
    console.log("[v0] Creating movies...");
    const movies = await Movie.insertMany([
      {
        title: "Stellar Horizon",
        genre: ["Sci-Fi", "Adventure"],
        releaseDate: new Date("2024-01-15"),
        director: "James Chen",
        cast: ["Emma Watson", "Tom Hardy", "Zendaya"],
        description: "A thrilling journey through space",
        viewers: 2500000,
        revenue: 425000000,
        marketingSpend: 75000000,
        rating: 8.5,
      },
      {
        title: "Echoes of Tomorrow",
        genre: ["Drama", "Thriller"],
        releaseDate: new Date("2024-02-10"),
        director: "Sofia Reyes",
        cast: ["Oscar Isaac", "Saoirse Ronan", "Timothée Chalamet"],
        description: "A mind-bending tale of time and memory",
        viewers: 1800000,
        revenue: 320000000,
        marketingSpend: 62000000,
        rating: 8.2,
      },
      {
        title: "The Last Guardian",
        genre: ["Fantasy", "Action"],
        releaseDate: new Date("2024-03-20"),
        director: "Denis Villeneuve",
        cast: ["Henry Cavill", "Gal Gadot", "Jason Momoa"],
        description: "An epic fantasy adventure",
        viewers: 3200000,
        revenue: 580000000,
        marketingSpend: 95000000,
        rating: 8.8,
      },
      {
        title: "Midnight in Paris Redux",
        genre: ["Romance", "Comedy"],
        releaseDate: new Date("2024-04-05"),
        director: "Greta Gerwig",
        cast: ["Margot Robbie", "Timothée Chalamet", "Florence Pugh"],
        description: "A romantic comedy across continents",
        viewers: 1200000,
        revenue: 245000000,
        marketingSpend: 48000000,
        rating: 7.9,
      },
      {
        title: "Quantum Entanglement",
        genre: ["Sci-Fi", "Mystery"],
        releaseDate: new Date("2024-05-12"),
        director: "Christopher Nolan",
        cast: [
          "Robert Pattinson",
          "Elizabeth Debicki",
          "John David Washington",
        ],
        description: "A complex scientific thriller",
        viewers: 2100000,
        revenue: 380000000,
        marketingSpend: 70000000,
        rating: 8.4,
      },
      {
        title: "Stellar Run",
        genre: ["Sci-Fi"],
        releaseDate: new Date("2024-03-15"),
        director: "Raj Sharma",
        viewers: 4200000,
        revenue: 9100000,
        marketingSpend: 12000000,
        rating: 8.9,
      },
      {
        title: "Dark Orbit",
        genre: ["Sci-Fi"],
        releaseDate: new Date("2024-06-20"),
        director: "Priya Nair",
        viewers: 3100000,
        revenue: 6700000,
        marketingSpend: 9000000,
        rating: 8.1,
      },
      {
        title: "Last Kingdom",
        genre: ["Drama"],
        releaseDate: new Date("2024-02-10"),
        director: "Arjun Das",
        viewers: 3800000,
        revenue: 8300000,
        marketingSpend: 8000000,
        rating: 8.6,
      },
      {
        title: "Neon Shadows",
        genre: ["Thriller"],
        releaseDate: new Date("2024-07-05"),
        director: "Meera Iyer",
        viewers: 2500000,
        revenue: 5100000,
        marketingSpend: 7000000,
        rating: 7.5,
      },
      {
        title: "The Wild Frontier",
        genre: ["Adventure"],
        releaseDate: new Date("2024-04-18"),
        director: "Vikram Sood",
        viewers: 2100000,
        revenue: 4300000,
        marketingSpend: 6000000,
        rating: 7.2,
      },
      {
        title: "Laugh Track",
        genre: ["Comedy"],
        releaseDate: new Date("2024-08-12"),
        director: "Raj Sharma",
        viewers: 900000,
        revenue: 1800000,
        marketingSpend: 3000000,
        rating: 6.1,
      },
      {
        title: "Silent Echo",
        genre: ["Drama"],
        releaseDate: new Date("2024-01-25"),
        director: "Priya Nair",
        viewers: 1800000,
        revenue: 3900000,
        marketingSpend: 5000000,
        rating: 7.8,
      },
      {
        title: "Blaze Protocol",
        genre: ["Action"],
        releaseDate: new Date("2024-09-03"),
        director: "Arjun Das",
        viewers: 2900000,
        revenue: 5900000,
        marketingSpend: 8500000,
        rating: 7.8,
      },
      {
        title: "Crimson Tide Rising",
        genre: ["Thriller"],
        releaseDate: new Date("2024-05-14"),
        director: "Meera Iyer",
        viewers: 2200000,
        revenue: 4600000,
        marketingSpend: 6500000,
        rating: 7.3,
      },
      {
        title: "Funny Bones",
        genre: ["Comedy"],
        releaseDate: new Date("2024-10-08"),
        director: "Vikram Sood",
        viewers: 800000,
        revenue: 1500000,
        marketingSpend: 2500000,
        rating: 5.9,
      },
      {
        title: "Terra Nova",
        genre: ["Sci-Fi"],
        releaseDate: new Date("2024-11-20"),
        director: "Raj Sharma",
        viewers: 2700000,
        revenue: 5500000,
        marketingSpend: 7500000,
        rating: 8.0,
      },
      {
        title: "City of Wolves",
        genre: ["Drama"],
        releaseDate: new Date("2024-03-30"),
        director: "Priya Nair",
        viewers: 1600000,
        revenue: 3200000,
        marketingSpend: 4500000,
        rating: 7.4,
      },
      {
        title: "Iron Pulse",
        genre: ["Action"],
        releaseDate: new Date("2024-12-05"),
        director: "Arjun Das",
        viewers: 2400000,
        revenue: 4800000,
        marketingSpend: 7000000,
        rating: 7.6,
      },
      {
        title: "Desert Mirage",
        genre: ["Adventure"],
        releaseDate: new Date("2024-06-17"),
        director: "Meera Iyer",
        viewers: 1400000,
        revenue: 2800000,
        marketingSpend: 4000000,
        rating: 7.0,
      },
      {
        title: "Midnight Circus",
        genre: ["Comedy"],
        releaseDate: new Date("2024-08-29"),
        director: "Vikram Sood",
        viewers: 700000,
        revenue: 1200000,
        marketingSpend: 2000000,
        rating: 5.7,
      },
    ]);

    console.log(`[v0] Created ${movies.length} movies`);

    // Create viewers by region
    console.log("[v0] Creating viewers...");
    const regions =['North', 'South', 'East', 'West', 'Central'];
    const ageGroups = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"];
    const genres = [
      "Action",
      "Drama",
      "Sci-Fi",
      "Romance",
      "Thriller",
      "Fantasy",
    ];

    const viewers = [];
    for (const region of regions) {
      for (const ageGroup of ageGroups) {
        viewers.push({
          region,
          ageGroup,
          watchCount: Math.floor(Math.random() * 50) + 5,
          totalWatchTime: Math.floor(Math.random() * 2000) + 200,
          favoriteGenres: genres.sort(() => 0.5 - Math.random()).slice(0, 3),
          subscriptionType: ["Free", "Premium", "Premium+"][
            Math.floor(Math.random() * 3)
          ],
        });
      }
    }

    const savedViewers = await Viewer.insertMany(viewers);
    console.log(`[v0] Created ${savedViewers.length} viewers`);

    // Create watch activities
    console.log("[v0] Creating watch activities...");
    const watchActivities = [];
    for (let i = 0; i < 500; i++) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      const viewer =
        savedViewers[Math.floor(Math.random() * savedViewers.length)];

      watchActivities.push({
        movieId: movie._id,
        viewerId: viewer._id,
        watchTime: Math.floor(Math.random() * 120) + 20,
        completionRate: Math.floor(Math.random() * 100),
        engagementScore: Math.floor(Math.random() * 100),
        region: viewer.region,
        deviceType: ["Mobile", "Tablet", "Desktop", "Smart TV"][
          Math.floor(Math.random() * 4)
        ],
        watchedAt: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ),
      });
    }

    await WatchActivity.insertMany(watchActivities);
    console.log(`[v0] Created ${watchActivities.length} watch activities`);

    // Create marketing spend records
    console.log("[v0] Creating marketing spend records...");
    const channels = ["TV", "Digital", "Print", "Outdoor"];
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
    console.log(
      `[v0] Created ${marketingSpends.length} marketing spend records`,
    );

    console.log("[v0] Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("[v0] Seeding error:", error);
    process.exit(1);
  }
}

seed();
