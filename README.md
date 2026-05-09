# AI Analytics Assistant

A production-ready, full-stack AI analytics platform for querying and visualizing business data with natural language. Built with Next.js 15, MongoDB, OpenAI, and modern enterprise UI patterns.

## Features

- **AI-Powered Analytics**: Ask natural language questions about your business data
- **Tool-Based Orchestration**: OpenAI automatically selects and executes appropriate tools
- **Secure Authentication**: JWT-based auth with HTTP-only cookies and role-based access
- **Real-time Chat Interface**: Interactive AI chat with tool execution tracing
- **File Upload & RAG**: Upload PDFs and CSVs for semantic search and analysis
- **Rich Visualizations**: Interactive charts and dashboards with Recharts
- **Enterprise UI**: Dark mode dashboard with glassmorphism effects
- **Production Ready**: Docker support, comprehensive error handling, input validation

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7.0+
- OpenAI API key
- pnpm (recommended) or npm

### Local Development

1. **Clone and install dependencies**:
```bash
git clone <repo-url>
cd ai-analytics
pnpm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```
MONGODB_URI=mongodb://localhost:27017/ai-analytics
JWT_SECRET=your_super_secret_jwt_key_change_this
OPENAI_API_KEY=sk-your-openai-api-key
NODE_ENV=development
```

3. **Start MongoDB locally** (or use MongoDB Atlas):
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Using Homebrew (macOS)
brew services start mongodb-community
```

4. **Seed the database**:
```bash
# Run the seed script
pnpm ts-node scripts/seed.ts

# Or use the API endpoint (requires auth)
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Cookie: auth_token=<your_jwt_token>"
```

5. **Start development server**:
```bash
pnpm dev
```

Visit `http://localhost:3000` and login with demo credentials:
- Email: `admin@example.com`
- Password: `admin123`

## Docker Setup

### Run with Docker Compose

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-your-api-key

# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f app

# Seed the database (from host)
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Cookie: auth_token=<your_jwt_token>"

# Stop services
docker-compose down
```

### Build Docker image manually

```bash
docker build -t ai-analytics:latest .
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://admin:admin123@mongodb:27017/ai-analytics?authSource=admin \
  -e JWT_SECRET=your_secret \
  -e OPENAI_API_KEY=sk-your-key \
  ai-analytics:latest
```

## Architecture

### Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **AI**: OpenAI SDK (tool calling)
- **Charts**: Recharts
- **Auth**: JWT with HTTP-only cookies
- **Validation**: Zod
- **File Parsing**: pdf-parse, papaparse

### Key Design Patterns

**Tool Orchestration**: OpenAI's tool calling (function calling) pattern allows the model to:
1. Analyze user questions
2. Select appropriate tools (movie performance, regional data, marketing spend, etc)
3. Execute tools with correct parameters
4. Format final responses with citations and insights

**RAG Pipeline**: 
- PDF/CSV chunking (500 tokens with overlap)
- Simple vector embeddings (character-code based)
- MongoDB vector search
- Context injection into OpenAI prompts

**Middleware Authentication**:
- JWT validation on all protected routes
- User context attached to request headers
- Automatic redirect to login for unauthenticated access

### API Endpoints

**Authentication**
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear cookies
- `GET /api/auth/verify` - Check authentication status

**Chat & AI**
- `POST /api/chat/message` - Send message to AI, returns response with tool traces

**Tools (Automatic via AI orchestration)**
- Movie tools: query performance, compare titles, get details
- Regional tools: engagement metrics, viewer demographics, performance
- Marketing tools: spend analysis, channel performance

**File Upload**
- `POST /api/upload/pdf` - Upload and process PDF files
- `POST /api/upload/csv` - Upload and process CSV files

**Admin**
- `POST /api/admin/seed` - Seed database with demo data (admin only)
- `GET /api/audit/logs` - View query audit logs (admin only)

## Database Schema

### Collections

**Users**
- email (unique)
- password (hashed with bcrypt)
- role (admin/analyst)
- createdAt, updatedAt

**Movies**
- title, genre[], director, cast[]
- viewers, revenue, rating, marketingSpend
- createdAt, updatedAt

**Viewers**
- region, ageGroup, subscriptionType
- watchCount, totalWatchTime, favoriteGenres[]

**WatchActivity**
- movieId, viewerId, region, deviceType
- watchTime, completionRate, engagementScore, watchedAt

**MarketingSpend**
- movieId, region, channel, date
- spendAmount, impressions, conversions

**UploadedDocuments**
- name, fileType (pdf/csv), filePath
- chunks[] with text and embeddings
- metadata (pageCount, fileSize, etc)
- uploadedBy, createdAt

**QueryLogs** (Audit trail)
- userId, queryText, toolsUsed[]
- response, executionTime, status
- createdAt

## Configuration

### Environment Variables

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/ai-analytics

# JWT secret for token signing (change in production!)
JWT_SECRET=super_secret_key_min_32_chars

# OpenAI API key
OPENAI_API_KEY=sk-your-api-key

# Node environment
NODE_ENV=development|production
```

### Tailwind Customization

Edit `tailwind.config.ts` to customize:
- Color schemes
- Typography
- Spacing
- Border radius
- Animation timings

## Deployment

### Deploy to Vercel

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard
# Push to main branch to deploy

# Environment variables needed:
# - MONGODB_URI (MongoDB Atlas connection string)
# - JWT_SECRET (strong random string)
# - OPENAI_API_KEY
```

### Deploy to Self-Hosted Server

```bash
# Using Docker Compose (recommended)
git clone <repo>
cd ai-analytics
export OPENAI_API_KEY=sk-your-key
docker-compose up -d

# Using systemd (alternative)
# Create systemd service file, configure reverse proxy (nginx), SSL certificates
```

## Security Considerations

**Authentication**
- JWT tokens stored in HTTP-only cookies (prevents XSS)
- 7-day token expiration
- Middleware validates all protected routes
- Password hashed with bcrypt (10 salt rounds)

**Input Validation**
- Zod schemas validate all API inputs
- No SQL injection risk (using Mongoose ODM)
- File uploads restricted to PDF/CSV
- Chat messages limited to 5000 characters

**Authorization**
- Role-based access control (admin/analyst)
- Audit logs for all queries
- User context scoped to database queries

**Best Practices for Production**
- Change JWT_SECRET to strong random value
- Use MongoDB Atlas with network access controls
- Enable HTTPS/SSL
- Set secure CORS policies
- Rate limit API endpoints
- Monitor error logs and query performance
- Regular database backups

## Performance Optimization

- Next.js image optimization
- Database query indexing on common fields
- Caching with ETag headers
- Client-side SWR for data fetching
- Lazy loading of chart components
- MongoDB connection pooling

## Development

### Project Structure

```
/app
  /api - API routes
  /dashboard - Main dashboard
  /login - Authentication page
  /upload - File upload page
  /analytics - Data visualization
  /history - Query history
  /settings - User settings

/components
  /layout - Sidebar, TopNavbar, DashboardLayout
  /chat - ChatPanel, ChatMessage, ChatInput, ToolTracePanel
  /insights - KPIGrid, InsightCard
  /analytics - Chart components
  /upload - UploadDropzone
  /ui - shadcn/ui components

/lib
  /mongodb.ts - Database connection
  /jwt.ts - Token utilities
  /validators.ts - Zod schemas

/models - Mongoose schemas
/tools - Tool implementations
/services - Business logic
/scripts - Database seeding
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test models/User.test.ts

# Watch mode
pnpm test --watch
```

### Code Quality

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm typecheck
```

## Troubleshooting

**MongoDB connection fails**
- Check MONGODB_URI is correct
- Ensure MongoDB is running
- Verify network access if using Atlas

**OpenAI API errors**
- Verify OPENAI_API_KEY is set correctly
- Check API key has funds
- Ensure model name (gpt-4o-mini) is available

**Authentication issues**
- Clear cookies and login again
- Check JWT_SECRET matches across sessions
- Verify token expiration (7 days)

**Charts not rendering**
- Check browser console for errors
- Ensure Recharts is installed
- Verify chart data format

**File upload fails**
- Check file size limits (10MB PDF, 50MB CSV)
- Ensure uploads directory is writable
- Verify file MIME type is correct

## License

MIT

## Support

For issues and feature requests, please open a GitHub issue or contact support@example.com

---

Built with Next.js, MongoDB, and OpenAI. Designed for enterprise analytics.
