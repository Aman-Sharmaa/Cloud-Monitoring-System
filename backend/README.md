# Cloud Monitoring - Backend

REST API for the Multi-Cloud Monitoring Dashboard built with Node.js, Express, and MongoDB.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloud-monitoring
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication Routes

**POST /api/auth/signup**
- Register a new user
- Body: `{ name, email, password }`
- Returns: `{ user, token }`

**POST /api/auth/login**
- Login existing user
- Body: `{ email, password }`
- Returns: `{ user, token }`

**POST /api/auth/logout**
- Logout user (client-side token removal)

### Metrics Routes (Protected)

**GET /api/metrics/dashboard**
- Get aggregated dashboard metrics
- Query: `?provider=all|aws|gcp|azure|digitalocean`
- Returns: Summary statistics and recent alerts

**GET /api/metrics/:provider/billing**
- Get billing metrics for a provider
- Query: `?days=7`
- Returns: Array of billing data points

**GET /api/metrics/:provider/resources**
- Get resource metrics (CPU, Memory, Storage)
- Query: `?days=7`
- Returns: Array of resource data points

**GET /api/metrics/:provider/performance**
- Get performance metrics (Latency, Throughput)
- Query: `?days=7`
- Returns: Array of performance data points

**POST /api/metrics/seed**
- Generate sample metrics data for development
- Returns: Success message with count

### User Routes (Protected)

**GET /api/users/profile**
- Get current user's profile
- Returns: User object

**PUT /api/users/profile**
- Update user profile
- Body: `{ name, email }`
- Returns: Updated user object

**PUT /api/users/password**
- Update user password
- Body: `{ currentPassword, newPassword }`
- Returns: Success message

**PUT /api/users/settings**
- Update user settings
- Body: `{ alertSettings, theme, cloudProviders }`
- Returns: Updated user object

**GET /api/users/alerts**
- Get user's alerts
- Returns: Array of alerts

## MongoDB Models

### User
- name, email, password (hashed)
- cloudProviders (aws, gcp, azure, digitalocean)
- alertSettings (thresholds and preferences)
- theme (light/dark)

### Metric
- userId, provider, metricType
- value, unit
- resourceId, resourceName
- timestamp

### Alert
- userId, provider, alertType
- threshold, currentValue
- message, severity
- triggered, resolved
- timestamps

## Authentication

Uses JWT (JSON Web Tokens) for authentication:
- Token expires in 7 days (configurable)
- Token sent in Authorization header: `Bearer <token>`
- Middleware validates token on protected routes

## Security Features

- Password hashing with bcrypt
- JWT token validation
- MongoDB injection prevention
- Input validation
- CORS enabled
- Error handling middleware

## Development Tools

- **nodemon**: Auto-restart on file changes
- **dotenv**: Environment variable management
- **mongoose**: MongoDB ODM
- **express**: Web framework
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **validator**: Data validation

