# AI Analytics Assistant - Setup Guide

Complete step-by-step guide to get the AI Analytics Assistant running locally and in production.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Database Setup](#database-setup)
5. [AI Configuration](#ai-configuration)
6. [Troubleshooting](#troubleshooting)

## Local Development

### Step 1: Prerequisites

Install the following:
- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **pnpm** 10+ (`npm install -g pnpm`)
- **MongoDB Community** 7.0+ ([mongodb.com/try](https://www.mongodb.com/try/download/community))
- **OpenAI API Key** ([platform.openai.com](https://platform.openai.com/api-keys))

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url> ai-analytics
cd ai-analytics

# Install dependencies
pnpm install

# Verify installations
pnpm --version  # Should be 10.x+
node --version  # Should be 20.x+
```

### Step 3: Environment Configuration

```bash
# Copy example env file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Your `.env.local` should contain:
```env
# Database - Use local MongoDB or MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/ai-analytics

# Authentication - Generate a random 32+ character string
# Option 1: Use Node to generate
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_key_min_32_characters

# AI - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-your-api-key-here

# Environment
NODE_ENV=development
```

### Step 4: Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
docker run -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  --name ai-mongodb \
  mongo:7.0

# Verify connection
mongodb://admin:admin123@localhost:27017
```

**Option B: Using Homebrew (macOS)**
```bash
# Install
brew tap mongodb/brew
brew install mongodb-community

# Start
brew services start mongodb-community

# Verify
mongosh mongodb://localhost:27017
```

**Option C: MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/ai-analytics?retryWrites=true&w=majority`
4. Use in `MONGODB_URI`

### Step 5: Seed Database

```bash
# Using the seed script
pnpm ts-node scripts/seed.ts

# Expected output:
# [v0] Connecting to database...
# [v0] Creating demo users...
# [v0] Created users:
#   - admin@example.com (admin)
#   - analyst@example.com (analyst)
# [v0] Created 5 movies
# [v0] Created 30 viewers
# [v0] Created 500 watch activities
# [v0] Created 300 marketing spend records
# [v0] Seeding complete!
```

### Step 6: Start Development Server

```bash
# Start dev server (includes hot reload)
pnpm dev

# Output:
# ▲ Next.js 15.x
#   Local:        http://localhost:3000
#   Environments: .env.local
```

### Step 7: Login and Test

1. Open browser: http://localhost:3000
2. You'll be redirected to login page
3. Use demo credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
4. You should see the dashboard!

### Step 8: Test AI Features

1. Go to Dashboard
2. In the "Ask a Question" chat box, try:
   - "What are the top performing movies?"
   - "Compare Stellar Horizon with Echoes of Tomorrow"
   - "What's the engagement rate in Europe?"
   - "Analyze marketing ROI for digital channels"

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Clone repository
git clone <repo-url> ai-analytics
cd ai-analytics

# Set OpenAI API key
export OPENAI_API_KEY=sk-proj-your-key

# Build and start all services
docker-compose up --build

# Wait for MongoDB health check (30 seconds)
# Access app at http://localhost:3000

# Seed database (in another terminal)
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Cookie: auth_token=<your_jwt_token>"

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
docker-compose logs -f mongodb
```

### Build Custom Docker Image

```bash
# Build image
docker build -t ai-analytics:latest .

# Run container
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-analytics \
  -e JWT_SECRET=your-secret-key \
  -e OPENAI_API_KEY=sk-your-key \
  --name ai-app \
  ai-analytics:latest

# Check logs
docker logs -f ai-app

# Stop container
docker stop ai-app
docker rm ai-app
```

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourname/ai-analytics.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select GitHub repo
   - Click "Import"

3. **Set Environment Variables**
   - Click "Environment Variables"
   - Add each variable:
     - `MONGODB_URI` = MongoDB Atlas connection string
     - `JWT_SECRET` = Generate secure random string
     - `OPENAI_API_KEY` = Your OpenAI API key
     - `NODE_ENV` = `production`

4. **Click Deploy**
   - Vercel will build and deploy
   - Your app will be live at `https://your-project.vercel.app`

### Deploy to AWS/Self-Hosted

1. **Using Docker Compose**
   ```bash
   # On your server
   git clone <repo> ai-analytics
   cd ai-analytics
   
   # Create production env file
   nano .env.production
   
   # Set environment variables
   export OPENAI_API_KEY=sk-your-key
   
   # Start services
   docker-compose -f docker-compose.yml up -d
   ```

2. **Using Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name analytics.example.com;
       
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name analytics.example.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Using systemd Service** (alternative to Docker)
   ```ini
   # /etc/systemd/system/ai-analytics.service
   [Unit]
   Description=AI Analytics Assistant
   After=network.target
   
   [Service]
   Type=simple
   User=analytics
   WorkingDirectory=/opt/ai-analytics
   ExecStart=/usr/bin/node /opt/ai-analytics/.next/standalone/server.js
   Restart=always
   Environment="NODE_ENV=production"
   Environment="MONGODB_URI=mongodb+srv://..."
   Environment="JWT_SECRET=..."
   Environment="OPENAI_API_KEY=..."
   
   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   # Enable and start service
   sudo systemctl daemon-reload
   sudo systemctl enable ai-analytics
   sudo systemctl start ai-analytics
   sudo systemctl status ai-analytics
   ```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up with email

2. **Create Cluster**
   - Click "Create" > "Build a database"
   - Choose "M0 Free" tier (or paid if needed)
   - Select your region
   - Click "Create Cluster"

3. **Get Connection String**
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with your database password
   - Use in `MONGODB_URI`

4. **Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Allow from Everywhere (0.0.0.0/0) for development
   - Restrict to specific IPs for production

### Local MongoDB

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Linux with apt
sudo apt-get install -y mongodb
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 mongo:7.0

# Connect
mongosh mongodb://localhost:27017
```

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/ai-analytics" \
  --out=./backup-$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/ai-analytics" \
  ./backup-20240508
```

## AI Configuration

### OpenAI Setup

1. **Create API Key**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy and save securely (never commit to git)
   - Use in `OPENAI_API_KEY`

2. **Supported Models**
   - `gpt-4o-mini` (default, fast and cost-effective)
   - `gpt-4o` (more powerful, higher cost)
   - `gpt-3.5-turbo` (older, cheaper)

3. **Change Model**
   Edit `/services/toolOrchestrator.ts`:
   ```typescript
   const response = await openai.chat.completions.create({
     model: 'gpt-4o-mini', // Change this line
     // ...
   });
   ```

4. **Monitor Usage**
   - Dashboard: [platform.openai.com/account/usage](https://platform.openai.com/account/usage)
   - Set up billing limits
   - Monitor API costs

### Tool Configuration

Tools are defined in `/services/toolOrchestrator.ts`. Each tool must have:
- Name and description
- Parameter schema (JSON Schema format)
- Implementation function

To add a new tool:
```typescript
// 1. Add to tool definitions
{
  type: 'function',
  function: {
    name: 'getTrendingMovies',
    description: 'Get trending movies in the last 30 days',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number' }
      }
    }
  }
}

// 2. Add implementation
async function getTrendingMovies(limit: number) {
  // Implementation here
}

// 3. Add to switch statement in executeTool()
case 'getTrendingMovies':
  result = await getTrendingMovies(args.limit);
  break;
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**
- MongoDB is not running
- Start MongoDB: `brew services start mongodb-community` (macOS)
- Or use MongoDB Atlas instead

**Error: "Authentication failed"**
- Wrong username/password in connection string
- Check env variable: `echo $MONGODB_URI`
- Verify credentials in MongoDB

### OpenAI API Issues

**Error: "invalid_api_key"**
- API key is incorrect or expired
- Get new key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Add to `.env.local`

**Error: "rate_limit_exceeded"**
- Your API request quota is exhausted
- Check usage at [platform.openai.com/account/usage](https://platform.openai.com/account/usage)
- Upgrade plan or wait for reset

**Error: "model not found"**
- Model name is incorrect
- Use `gpt-4o-mini` (default and recommended)

### Authentication Issues

**Can't login**
- Clear cookies: Dev Tools > Application > Cookies > Delete auth_token
- Verify database has user records
- Check JWT_SECRET is consistent

**Token expired**
- Tokens expire after 7 days
- Clear cookies and login again
- Change expiration in `/lib/jwt.ts` if needed

### Performance Issues

**Slow chat responses**
- OpenAI API is slow (normal - can take 5-30 seconds)
- Check network latency: `ping api.openai.com`
- Reduce tool complexity if possible

**Database queries slow**
- Add indexes: `db.movies.createIndex({ title: 1 })`
- Check MongoDB performance: MongoDB Atlas > Clusters > Performance

### File Upload Issues

**Error: "Only PDF files are supported"**
- File MIME type is incorrect
- Try uploading from different source
- Verify file is valid PDF

**Error: "Failed to upload PDF"**
- File size exceeds limit (10MB)
- Reduce PDF size or split into multiple files
- Check disk space on server

---

For additional help, check the [README.md](./README.md) or open an issue on GitHub.
