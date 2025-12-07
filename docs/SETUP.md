# Temple Crowd Management System - Setup Guide

## Complete Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))

### Step 1: Clone the Repository

```bash
git clone https://github.com/keshavpandey200222-cell/temple-crowd-management.git
cd temple-crowd-management
```

### Step 2: Database Setup

#### PostgreSQL Setup

1. Create a new PostgreSQL database:
```bash
createdb temple_db
```

2. Create a database user:
```bash
psql -d temple_db
CREATE USER temple_user WITH PASSWORD 'temple_pass';
GRANT ALL PRIVILEGES ON DATABASE temple_db TO temple_user;
\q
```

3. Run the schema:
```bash
psql -d temple_db -U temple_user -f database/schema.sql
```

4. Seed the database:
```bash
psql -d temple_db -U temple_user -f database/seed.sql
```

#### MongoDB Setup (for Analytics)

1. Install MongoDB or use MongoDB Atlas
2. Create a database named `temple_analytics`

#### Redis Setup

1. Start Redis server:
```bash
redis-server
```

### Step 3: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://temple_user:temple_pass@localhost:5432/temple_db
MONGODB_URL=mongodb://localhost:27017/temple_analytics
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 4: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 5: Verify Installation

1. Open your browser and go to `http://localhost:3000`
2. You should see the Temple Crowd Management homepage
3. Try registering a new account
4. Check the crowd monitoring page
5. Test the booking system

### Default Admin Credentials

After seeding the database, you can login with:
- **Email**: admin@temple.com
- **Password**: admin123 (Note: Change this in production!)

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:
1. Verify PostgreSQL is running: `pg_isready`
2. Check your DATABASE_URL in `.env`
3. Ensure the database exists: `psql -l`

### Port Already in Use

If port 5000 or 3000 is already in use:
1. Change PORT in backend `.env`
2. Update proxy in frontend `vite.config.ts`

### Redis Connection Failed

If Redis connection fails:
1. Check if Redis is running: `redis-cli ping`
2. Verify REDIS_URL in `.env`

## Next Steps

1. **Configure External Services**:
   - Set up Twilio for SMS notifications
   - Configure SendGrid for emails
   - Add Razorpay keys for payments
   - Get Google Maps API key

2. **Customize the Application**:
   - Update temple zones in database
   - Configure slot timings
   - Set pricing for VIP bookings
   - Customize alert thresholds

3. **Deploy to Production**:
   - See `docs/DEPLOYMENT.md` for deployment guide
   - Configure production environment variables
   - Set up SSL certificates
   - Configure domain names

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Database Migrations

```bash
cd backend
npm run migrate
```

## Support

For issues or questions:
- Check the documentation in `/docs`
- Review the API documentation at `/docs/API.md`
- Open an issue on GitHub

## License

MIT License - see LICENSE file for details
