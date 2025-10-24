# API Documentation

Complete API reference for the Multi-Cloud Monitoring Dashboard.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Auth Endpoints

### 1. Sign Up

Create a new user account.

**Endpoint:** `POST /auth/signup`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6123456789abcdef",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login

Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6123456789abcdef",
      "name": "John Doe",
      "email": "john@example.com",
      "theme": "light"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Logout

Logout user (client-side token removal).

**Endpoint:** `POST /auth/logout`

**Access:** Public

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 4. Get Current User

Get the currently authenticated user's information.

**Endpoint:** `GET /auth/me`

**Access:** Private

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "6123456789abcdef",
    "name": "John Doe",
    "email": "john@example.com",
    "theme": "light",
    "cloudProviders": { ... },
    "alertSettings": { ... },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Metrics Endpoints

### 1. Get Dashboard Metrics

Get aggregated metrics for the dashboard.

**Endpoint:** `GET /metrics/dashboard`

**Access:** Private

**Query Parameters:**
- `provider` (optional): Filter by provider (aws, gcp, azure, digitalocean, all)

**Example:** `GET /metrics/dashboard?provider=aws`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBilling": "1234.56",
      "avgCpu": "67.89",
      "avgMemory": "72.34",
      "avgStorage": "78.90"
    },
    "metrics": [
      {
        "_id": {
          "provider": "aws",
          "metricType": "billing"
        },
        "value": 567.89,
        "unit": "USD",
        "timestamp": "2025-01-15T12:00:00.000Z"
      }
    ],
    "alerts": [
      {
        "_id": "alert123",
        "provider": "aws",
        "alertType": "cost",
        "message": "Cost exceeded threshold",
        "severity": "high",
        "createdAt": "2025-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 2. Get Billing Metrics

Get billing metrics for a specific provider.

**Endpoint:** `GET /metrics/:provider/billing`

**Access:** Private

**Path Parameters:**
- `provider`: Cloud provider (aws, gcp, azure, digitalocean)

**Query Parameters:**
- `days` (optional, default: 7): Number of days to retrieve

**Example:** `GET /metrics/aws/billing?days=30`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "metric123",
      "userId": "user123",
      "provider": "aws",
      "metricType": "billing",
      "value": 234.56,
      "unit": "USD",
      "timestamp": "2025-01-15T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Resource Metrics

Get resource utilization metrics (CPU, Memory, Storage).

**Endpoint:** `GET /metrics/:provider/resources`

**Access:** Private

**Path Parameters:**
- `provider`: Cloud provider

**Query Parameters:**
- `days` (optional, default: 7)

**Example:** `GET /metrics/gcp/resources?days=14`

---

### 4. Get Performance Metrics

Get performance metrics (Latency, Throughput).

**Endpoint:** `GET /metrics/:provider/performance`

**Access:** Private

**Path Parameters:**
- `provider`: Cloud provider

**Query Parameters:**
- `days` (optional, default: 7)

**Example:** `GET /metrics/azure/performance?days=7`

---

### 5. Get All Metrics

Get all metrics for a provider with optional type filtering.

**Endpoint:** `GET /metrics/:provider/all`

**Access:** Private

**Path Parameters:**
- `provider`: Cloud provider

**Query Parameters:**
- `days` (optional, default: 7)
- `type` (optional): Filter by metric type (billing, cpu, memory, storage, latency, throughput)

**Example:** `GET /metrics/digitalocean/all?days=30&type=cpu`

---

### 6. Seed Sample Metrics

Generate sample metrics data for testing.

**Endpoint:** `POST /metrics/seed`

**Access:** Private

**Response:**
```json
{
  "success": true,
  "message": "Sample metrics seeded successfully",
  "count": 168
}
```

---

### 7. Clear Metrics

Delete all metrics for the authenticated user.

**Endpoint:** `DELETE /metrics/clear`

**Access:** Private

**Response:**
```json
{
  "success": true,
  "message": "Metrics cleared successfully",
  "deletedCount": 168
}
```

---

## User Endpoints

### 1. Get User Profile

Get the user's profile information.

**Endpoint:** `GET /users/profile`

**Access:** Private

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "theme": "light",
    "cloudProviders": { ... },
    "alertSettings": { ... },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Update User Profile

Update user's name and/or email.

**Endpoint:** `PUT /users/profile`

**Access:** Private

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### 3. Update Password

Change user's password.

**Endpoint:** `PUT /users/password`

**Access:** Private

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### 4. Update Settings

Update user settings (alerts, theme, cloud providers).

**Endpoint:** `PUT /users/settings`

**Access:** Private

**Request Body:**
```json
{
  "theme": "dark",
  "alertSettings": {
    "costThreshold": 1500,
    "cpuThreshold": 85,
    "memoryThreshold": 85,
    "storageThreshold": 90,
    "notificationsEnabled": true
  },
  "cloudProviders": {
    "aws": {
      "connected": true,
      "accessKeyId": "AKIA...",
      "secretAccessKey": "...",
      "region": "us-east-1"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": { ... }
}
```

---

### 5. Get Alerts

Retrieve user's alerts with optional filtering.

**Endpoint:** `GET /users/alerts`

**Access:** Private

**Query Parameters:**
- `resolved` (optional): Filter by resolved status (true, false)
- `limit` (optional, default: 50): Maximum number of alerts to return

**Example:** `GET /users/alerts?resolved=false&limit=20`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "alert123",
      "userId": "user123",
      "provider": "aws",
      "alertType": "cost",
      "threshold": 1000,
      "currentValue": 1250,
      "message": "Cost threshold exceeded",
      "severity": "high",
      "triggered": true,
      "resolved": false,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 6. Create Alert

Create a new alert.

**Endpoint:** `POST /users/alerts`

**Access:** Private

**Request Body:**
```json
{
  "provider": "aws",
  "alertType": "cost",
  "threshold": 1000,
  "currentValue": 1250,
  "message": "Monthly cost exceeded $1000",
  "severity": "high"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert created successfully",
  "data": { ... }
}
```

---

### 7. Resolve Alert

Mark an alert as resolved.

**Endpoint:** `PUT /users/alerts/:id/resolve`

**Access:** Private

**Path Parameters:**
- `id`: Alert ID

**Example:** `PUT /users/alerts/alert123/resolve`

**Response:**
```json
{
  "success": true,
  "message": "Alert resolved successfully",
  "data": { ... }
}
```

---

### 8. Delete Alert

Delete an alert.

**Endpoint:** `DELETE /users/alerts/:id`

**Access:** Private

**Path Parameters:**
- `id`: Alert ID

**Example:** `DELETE /users/alerts/alert123`

**Response:**
```json
{
  "success": true,
  "message": "Alert deleted successfully"
}
```

---

### 9. Get User Statistics

Get user's usage statistics.

**Endpoint:** `GET /users/stats`

**Access:** Private

**Response:**
```json
{
  "success": true,
  "data": {
    "metricsCount": 168,
    "alertsCount": 12,
    "unresolvedAlertsCount": 3,
    "connectedProvidersCount": 2,
    "connectedProviders": ["aws", "gcp"]
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Dashboard (with token)
```bash
curl http://localhost:5000/api/metrics/dashboard?provider=all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Alert
```bash
curl -X POST http://localhost:5000/api/users/alerts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "alertType": "cost",
    "threshold": 1000,
    "currentValue": 1250,
    "message": "Cost exceeded threshold",
    "severity": "high"
  }'
```

---

## Frontend API Client Usage

The frontend includes a complete API client. Example usage:

```javascript
import { authAPI, metricsAPI, usersAPI } from '@/lib/api';

// Login
const response = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get dashboard
const dashboard = await metricsAPI.getDashboard('aws');

// Get user stats
const stats = await usersAPI.getStats();

// Resolve alert
await usersAPI.resolveAlert('alert123');
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## Pagination

Currently not implemented. Large datasets return all results. Consider implementing pagination for production use.

## WebSocket Support

Not currently implemented. Consider adding WebSocket support for real-time metrics updates.

