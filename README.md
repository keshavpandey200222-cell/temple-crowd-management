# Temple Crowd Management System

A comprehensive web application for intelligent crowd management in temples using real-time monitoring, predictive analytics, and smart queue systems.

## Features

### For Visitors
- **Online Booking System**: Book darshan slots in advance
- **Real-Time Crowd Updates**: View live crowd density across temple zones
- **Smart Queue Management**: Virtual queue with wait time estimates
- **Interactive Navigation**: Find optimal routes avoiding crowded areas
- **Multi-language Support**: Accessible in multiple languages

### For Temple Administration
- **Live Monitoring Dashboard**: Real-time crowd tracking across all zones
- **Predictive Analytics**: Forecast crowd patterns for better planning
- **Queue Management**: Control and optimize multiple queue systems
- **Staff Allocation**: Data-driven staff deployment
- **Emergency Alerts**: Instant notifications for crowd threshold breaches

### Smart Features
- QR code-based entry system
- SMS/Email notifications
- Heat map visualization
- Historical analytics
- Mobile-responsive design

## Technology Stack

### Frontend
- React.js 18+ with TypeScript
- Next.js for server-side rendering
- Tailwind CSS for styling
- Redux Toolkit for state management
- Socket.io-client for real-time updates

### Backend
- Node.js with Express.js
- Python for ML/Analytics
- Socket.io for WebSockets
- JWT authentication
- RESTful APIs

### Database
- PostgreSQL (Primary database)
- MongoDB (Analytics data)
- Redis (Caching & real-time data)

### DevOps
- Docker containerization
- GitHub Actions CI/CD
- AWS/GCP cloud hosting

## Project Structure

```
temple-crowd-management/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx
│   └── package.json
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   └── server.ts
│   └── package.json
│
├── analytics/                # Python analytics service
│   ├── models/              # ML models
│   ├── services/            # Analytics services
│   └── requirements.txt
│
├── database/                 # Database schemas
│   ├── migrations/
│   └── seeds/
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/keshavpandey200222-cell/temple-crowd-management.git
cd temple-crowd-management
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations
```bash
npm run migrate
```

6. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## API Documentation

API documentation is available at `/docs/API.md`

## Deployment

Deployment guide is available at `/docs/DEPLOYMENT.md`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Project Link: https://github.com/keshavpandey200222-cell/temple-crowd-management

## Acknowledgments

- Built for improving temple visitor experience
- Focused on safety and crowd management
- Leveraging modern web technologies
