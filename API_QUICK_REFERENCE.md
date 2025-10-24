# API Quick Reference Guide

Quick reference for all available API endpoints and frontend usage.

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run dev  # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

---

## 📡 All API Endpoints (27)

### Auth (4 endpoints)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Metrics (7 endpoints)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/metrics/dashboard` | Dashboard metrics | ✅ |
| GET | `/api/metrics/:provider/billing` | Billing data | ✅ |
| GET | `/api/metrics/:provider/resources` | Resource metrics | ✅ |
| GET | `/api/metrics/:provider/performance` | Performance data | ✅ |
| GET | `/api/metrics/:provider/all` | All metrics | ✅ |
| POST | `/api/metrics/seed` | Generate sample data | ✅ |
| DELETE | `/api/metrics/clear` | Clear all metrics | ✅ |

### Users (9 endpoints)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get user profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| PUT | `/api/users/password` | Change password | ✅ |
| PUT | `/api/users/settings` | Update settings | ✅ |
| GET | `/api/users/alerts` | Get alerts | ✅ |
| POST | `/api/users/alerts` | Create alert | ✅ |
| PUT | `/api/users/alerts/:id/resolve` | Resolve alert | ✅ |
| DELETE | `/api/users/alerts/:id` | Delete alert | ✅ |
| GET | `/api/users/stats` | Get statistics | ✅ |

---

## 💻 Frontend API Usage

### Import
```javascript
import { authAPI, metricsAPI, usersAPI } from '@/lib/api';
```

### Auth APIs

```javascript
// Signup
const response = await authAPI.signup({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Login
const response = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get current user
const user = await authAPI.getMe();

// Logout
await authAPI.logout();
```

### Metrics APIs

```javascript
// Get dashboard
const dashboard = await metricsAPI.getDashboard('aws');
// provider: 'all', 'aws', 'gcp', 'azure', 'digitalocean'

// Get billing
const billing = await metricsAPI.getBilling('aws', 7);
// provider, days

// Get resources
const resources = await metricsAPI.getResources('gcp', 14);

// Get performance
const performance = await metricsAPI.getPerformance('azure', 30);

// Get all metrics
const all = await metricsAPI.getAllMetrics('aws', 7, 'cpu');
// provider, days, type (optional)

// Seed sample data
await metricsAPI.seedMetrics();

// Clear all metrics
await metricsAPI.clearMetrics();
```

### Users APIs

```javascript
// Get profile
const profile = await usersAPI.getProfile();

// Update profile
await usersAPI.updateProfile({
  name: 'John Smith',
  email: 'johnsmith@example.com'
});

// Change password
await usersAPI.updatePassword({
  currentPassword: 'old123',
  newPassword: 'new123'
});

// Update settings
await usersAPI.updateSettings({
  theme: 'dark',
  alertSettings: {
    costThreshold: 1500,
    cpuThreshold: 85,
    memoryThreshold: 85,
    storageThreshold: 90,
    notificationsEnabled: true
  }
});

// Get alerts
const alerts = await usersAPI.getAlerts(false, 50);
// resolved (true/false/null), limit

// Create alert
await usersAPI.createAlert({
  provider: 'aws',
  alertType: 'cost',
  threshold: 1000,
  currentValue: 1250,
  message: 'Cost exceeded',
  severity: 'high'
});

// Resolve alert
await usersAPI.resolveAlert('alert123');

// Delete alert
await usersAPI.deleteAlert('alert123');

// Get statistics
const stats = await usersAPI.getStats();
```

---

## 🎯 Frontend Pages

| Path | Component | Description |
|------|-----------|-------------|
| `/` | index.js | Landing/redirect |
| `/login` | login.js | User login |
| `/signup` | signup.js | User registration |
| `/dashboard` | dashboard.js | Main dashboard |
| `/monitoring` | monitoring.js | Charts & analytics |
| `/alerts` | alerts.js | Alert management |
| `/profile` | profile.js | User profile & stats |
| `/settings` | settings.js | User settings |

---

## 🔧 Backend Controllers

### authController.js
- `signup()` - Register user
- `login()` - Authenticate user
- `logout()` - Logout handling
- `getMe()` - Get current user

### metricsController.js
- `getDashboard()` - Dashboard metrics
- `getBilling()` - Billing data
- `getResources()` - Resource metrics
- `getPerformance()` - Performance data
- `getAllMetrics()` - All metrics with filter
- `seedMetrics()` - Generate samples
- `clearMetrics()` - Delete all

### usersController.js
- `getProfile()` - Get profile
- `updateProfile()` - Update profile
- `updatePassword()` - Change password
- `updateSettings()` - Update settings
- `getAlerts()` - Get alerts
- `createAlert()` - Create alert
- `resolveAlert()` - Resolve alert
- `deleteAlert()` - Delete alert
- `getStats()` - Get statistics

---

## 📊 Common Query Parameters

### Metrics
- `provider` - aws, gcp, azure, digitalocean, all
- `days` - Number of days (7, 14, 30)
- `type` - billing, cpu, memory, storage, latency, throughput

### Alerts
- `resolved` - true, false, null (all)
- `limit` - Number of results (default 50)

---

## 🔐 Authentication Flow

1. **Signup/Login** → Receive JWT token
2. **Store token** → `localStorage.setItem('token', token)`
3. **API calls** → Token auto-added to headers
4. **401 Error** → Auto redirect to login

---

## 📝 Example Request/Response

### Login Request
```javascript
const response = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
});

// Response
{
  success: true,
  message: 'Login successful',
  data: {
    user: { id, name, email, theme },
    token: 'eyJhbGciOiJIUzI1...'
  }
}
```

### Get Dashboard
```javascript
const dashboard = await metricsAPI.getDashboard('aws');

// Response
{
  success: true,
  data: {
    summary: {
      totalBilling: '1234.56',
      avgCpu: '67.89',
      avgMemory: '72.34',
      avgStorage: '78.90'
    },
    metrics: [...],
    alerts: [...]
  }
}
```

### Get Stats
```javascript
const stats = await usersAPI.getStats();

// Response
{
  success: true,
  data: {
    metricsCount: 168,
    alertsCount: 12,
    unresolvedAlertsCount: 3,
    connectedProvidersCount: 2,
    connectedProviders: ['aws', 'gcp']
  }
}
```

---

## 🎨 UI Components Used

- `Button` - Actions
- `Card` - Content containers
- `Input` - Form inputs
- `Label` - Form labels
- `Select` - Dropdowns
- `Tabs` - Tabbed interfaces
- `Alert` - Messages
- `Table` - Data tables

---

## 🚨 Error Handling

All API calls return:
```javascript
{
  success: boolean,
  message?: string,
  data?: any
}
```

Error responses:
```javascript
{
  success: false,
  message: 'Error description'
}
```

Status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## 📚 Documentation Files

1. **README.md** - Main project overview
2. **QUICKSTART.md** - Setup guide
3. **API_DOCUMENTATION.md** - Complete API docs
4. **CONTROLLERS_UPDATE.md** - Implementation details
5. **API_QUICK_REFERENCE.md** - This file
6. **backend/README.md** - Backend docs
7. **frontend/README.md** - Frontend docs

---

## 🎯 Testing Commands

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Test dashboard (with token)
curl http://localhost:5000/api/metrics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test stats
curl http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✨ Summary

- **27 API Endpoints** - Complete backend coverage
- **9 Frontend Pages** - Full user interface
- **20 Controller Functions** - Clean MVC architecture
- **3 API Client Modules** - Easy frontend integration
- **Auto Error Handling** - Built-in 401 redirect
- **Complete CRUD** - All resources fully manageable

**Everything is ready to use!** 🚀

