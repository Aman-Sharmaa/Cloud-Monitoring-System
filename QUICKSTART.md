# Quick Start Guide

Get your Multi-Cloud Monitoring Dashboard up and running in 5 minutes!

## Prerequisites

Make sure you have installed:
- Node.js (v16 or higher)
- MongoDB (running locally or use MongoDB Atlas)
- npm or yarn

## Step 1: Start MongoDB

If using local MongoDB:
```bash
# Start MongoDB service
mongod
# or on macOS with Homebrew:
brew services start mongodb-community
```

Or use MongoDB Atlas (cloud): Get connection string from https://www.mongodb.com/cloud/atlas

## Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloud-monitoring
JWT_SECRET=my_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EOF

# Start the backend server
npm run dev
```

✅ Backend should now be running at http://localhost:5000

## Step 3: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start the frontend
npm run dev
```

✅ Frontend should now be running at http://localhost:3000

## Step 4: Create Account & Generate Data

1. Open http://localhost:3000 in your browser
2. Click "Sign up" and create an account
3. You'll be redirected to the dashboard
4. Click "Generate Sample Data" to populate metrics
5. Explore the app!

## What to Try

### Dashboard
- View aggregated metrics from all providers
- Filter by cloud provider (AWS, GCP, Azure, DigitalOcean)
- Check recent alerts
- Refresh data

### Monitoring
- Switch between Billing, Resources, and Performance tabs
- Change date ranges (7, 14, 30 days)
- Select different cloud providers
- View interactive charts

### Settings
- Update your profile (Profile tab)
- Change your password (Security tab)
- Configure alert thresholds (Alerts tab)
- Connect cloud providers (Cloud Providers tab)

### Dark Mode
- Toggle dark/light mode using the sun/moon icon in the header

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongo` or `mongosh`
- Verify .env file exists and has correct MongoDB URI
- Check port 5000 is not already in use

### Frontend won't start
- Verify backend is running first
- Check .env.local file exists
- Check port 3000 is not already in use

### Can't login
- Make sure backend is running
- Check browser console for errors
- Verify MongoDB connection

### No data showing
- Click "Generate Sample Data" on the dashboard
- Check Network tab in browser DevTools for API errors

## API Testing

You can test the API directly using curl or Postman:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get dashboard (replace YOUR_TOKEN with token from login)
curl http://localhost:5000/api/metrics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in .env
2. Use strong JWT_SECRET
3. Use MongoDB Atlas or secure MongoDB instance
4. Deploy to services like Heroku, Railway, or AWS

### Frontend
1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Run `npm run build`
3. Deploy to Vercel, Netlify, or your hosting service

## Next Steps

- Customize the UI colors in `tailwind.config.js`
- Add more metric types
- Integrate real cloud provider APIs
- Set up email notifications for alerts
- Add user teams and permissions

## Need Help?

Check the detailed documentation:
- Main README: `/README.md`
- Backend README: `/backend/README.md`
- Frontend README: `/frontend/README.md`

---

🎉 **Enjoy your Multi-Cloud Monitoring Dashboard!**

