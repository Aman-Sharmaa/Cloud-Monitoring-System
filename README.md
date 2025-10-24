# Multi-Cloud Monitoring Dashboard

A full-stack application for monitoring multiple cloud providers (AWS, GCP, Azure, DigitalOcean) with real-time metrics, billing tracking, and performance analytics.

## Tech Stack

### Frontend
- **Next.js** - React framework
- **ShadCN UI** - Component library
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Next Themes** - Dark/Light mode

### Backend
- **Node.js + Express** - REST API
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password encryption

## Features

✅ **Authentication**
- Login/Signup with email and password
- JWT-based session management
- Password encryption with bcrypt

✅ **Dashboard**
- Aggregated metrics from multiple cloud providers
- Billing overview and resource usage
- Performance metrics and health status
- Filter by provider
- Recent alerts section

✅ **Monitoring**
- Detailed metrics with interactive charts
- Cost trends visualization
- Resource utilization graphs (CPU, Memory, Storage)
- Performance metrics (Latency, Throughput)
- Configurable time ranges (7, 14, 30 days)

✅ **Settings**
- User profile management
- Password change
- Alert threshold configuration
- Cloud provider account connections
- Enable/disable notifications

✅ **UI/UX**
- Responsive design
- Dark and light mode
- Clean ShadCN components
- Smooth navigation

## Project Structure

```
cloud/
├── backend/           # Node.js + Express API
│   ├── config/        # Configuration files
│   ├── controllers/   # Business logic (MVC pattern)
│   ├── middleware/    # JWT authentication
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── utils/         # Helper functions
│   ├── server.js      # Entry point
│   └── API_DOCUMENTATION.md  # Complete API docs
│
└── frontend/          # Next.js application
    ├── src/
    │   ├── components/    # React components
    │   ├── lib/          # Utilities and API client
    │   ├── pages/        # Next.js pages
    │   └── styles/       # Global styles
    └── public/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI and JWT secret:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloud-monitoring
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Create an Account

1. Navigate to `http://localhost:3000`
2. Click "Sign up" and create an account
3. You'll be automatically logged in and redirected to the dashboard

### 2. Generate Sample Data

Since this is a demo application, you can generate sample metrics data:

1. Go to the Dashboard
2. Click the "Generate Sample Data" button
3. Sample metrics for all cloud providers will be created for the last 7 days

### 3. Explore Features

- **Dashboard**: View aggregated metrics and recent alerts
- **Monitoring**: Explore detailed charts and performance data
- **Alerts**: Manage and resolve alerts with full CRUD operations
- **Profile**: View statistics and manage your data
- **Settings**: 
  - Update your profile
  - Change password
  - Configure alert thresholds
  - Connect cloud provider accounts (UI only - actual API integration not included)

## API Endpoints (27 Total)

### Authentication (4)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Metrics (7)
- `GET /api/metrics/dashboard` - Get dashboard metrics
- `GET /api/metrics/:provider/billing` - Get billing metrics
- `GET /api/metrics/:provider/resources` - Get resource metrics
- `GET /api/metrics/:provider/performance` - Get performance metrics
- `GET /api/metrics/:provider/all` - Get all metrics with filtering
- `POST /api/metrics/seed` - Seed sample data
- `DELETE /api/metrics/clear` - Clear all metrics

### Users (9)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password
- `PUT /api/users/settings` - Update user settings
- `GET /api/users/alerts` - Get user alerts (with filtering)
- `POST /api/users/alerts` - Create new alert
- `PUT /api/users/alerts/:id/resolve` - Resolve an alert
- `DELETE /api/users/alerts/:id` - Delete an alert
- `GET /api/users/stats` - Get user statistics

See `backend/API_DOCUMENTATION.md` for complete API reference.

## Database Schema

### Users Collection
- Profile information (name, email)
- Encrypted password
- Cloud provider configurations
- Alert settings
- Theme preference

### Metrics Collection
- Provider (aws, gcp, azure, digitalocean)
- Metric type (billing, cpu, memory, storage, latency, throughput)
- Value and unit
- Timestamp
- Resource details

### Alerts Collection
- User reference
- Provider and alert type
- Threshold and current value
- Severity and status
- Timestamps

## Features in Detail

### Dark Mode
The application supports dark and light themes. Toggle using the sun/moon icon in the header.

### Responsive Design
Fully responsive layout that works on desktop, tablet, and mobile devices.

### Real-time Metrics
While this demo uses sample data, the architecture supports real-time metrics from actual cloud provider APIs.

### Alert System
Configure custom thresholds for cost, CPU, memory, and storage. The system tracks when metrics exceed thresholds.

## Development Notes

- All code is in plain JavaScript (no TypeScript)
- **MVC Architecture** - Controllers separate business logic from routes
- Uses ShadCN UI components exclusively
- JWT tokens stored in localStorage with auto-refresh on 401
- Passwords hashed with bcrypt (10 salt rounds)
- MongoDB indexes on frequently queried fields
- Comprehensive error handling and validation
- Complete API client with all 27 endpoints
- Full CRUD operations for all resources

## Future Enhancements

- Actual cloud provider API integration
- Email notifications for alerts
- Export metrics to CSV/PDF
- Multi-user teams and organizations
- More detailed resource-level metrics
- Cost optimization recommendations

## License

MIT

## Author

Built as a demonstration of a full-stack multi-cloud monitoring solution.

