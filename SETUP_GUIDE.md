# Complete Setup Guide

Step-by-step guide to get your Multi-Cloud Monitoring Dashboard running.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** v16+ installed (`node --version`)
- ✅ **MongoDB** installed and running
- ✅ **npm** or **yarn** package manager

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start MongoDB

```bash
# Option 1: Local MongoDB
mongod

# Option 2: macOS with Homebrew
brew services start mongodb-community

# Option 3: Use MongoDB Atlas (cloud)
# Get connection string from https://cloud.mongodb.com
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloud-monitoring
JWT_SECRET=change_this_to_a_secure_random_string_in_production
JWT_EXPIRE=7d
NODE_ENV=development
EOF

# Start the backend server
npm run dev
```

✅ **Backend should now be running at http://localhost:5000**

### Step 3: Setup Frontend (New Terminal)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create environment file (if not exists)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start the frontend
npm run dev
```

✅ **Frontend should now be running at http://localhost:3000**

---

## 🔧 Troubleshooting

### Issue 1: Module not found '@/styles/globals.css'

**Solution:** The `jsconfig.json` file has been created automatically. If issue persists:

```bash
cd frontend

# Verify jsconfig.json exists
ls -la jsconfig.json

# If not, create it
cat > jsconfig.json << 'EOF'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOF

# Restart the dev server
npm run dev
```

### Issue 2: Port Already in Use

**Frontend:**
```bash
# Next.js will automatically try ports 3001, 3002, etc.
# Or specify a custom port:
PORT=3005 npm run dev
```

**Backend:**
```bash
# Change port in .env file
PORT=5001

# Or set inline
PORT=5001 npm run dev
```

### Issue 3: MongoDB Connection Error

**Check MongoDB is running:**
```bash
# Test connection
mongo
# or
mongosh

# If not running, start it:
brew services start mongodb-community
# or
mongod
```

**For MongoDB Atlas (cloud):**
```bash
# Update .env with your Atlas connection string:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloud-monitoring
```

### Issue 4: CORS Errors

The backend has CORS enabled by default. If you still get CORS errors:

**Backend:** Check `server.js` has:
```javascript
const cors = require('cors');
app.use(cors());
```

**Frontend:** Verify `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Issue 5: JWT Token Errors (401)

**Clear browser storage:**
```javascript
// Open browser console and run:
localStorage.clear()
// Then refresh and login again
```

### Issue 6: npm install fails

**Clear cache and reinstall:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## ✅ Verify Installation

### Test Backend

```bash
# Test server is running
curl http://localhost:5000/api/auth/login

# Should return: {"success":false,"message":"Please provide email and password"}
```

### Test Frontend

1. Open browser to http://localhost:3000
2. You should see login page or redirect
3. No console errors about missing modules

---

## 🎯 First Use

### 1. Create Account

1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter name, email, password
4. You'll be logged in automatically

### 2. Generate Sample Data

1. After login, you'll be on the dashboard
2. Click "Generate Sample Data" button
3. Sample metrics will be created for all cloud providers

### 3. Explore

- **Dashboard** - View aggregated metrics
- **Monitoring** - Interactive charts
- **Alerts** - Manage alerts
- **Profile** - View statistics
- **Settings** - Configure everything

---

## 📁 Project Structure Verification

Your directory should look like this:

```
cloud/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── config/
│   ├── package.json
│   ├── .env              ← Must exist
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   ├── jsconfig.json     ← Must exist
│   ├── .env.local        ← Must exist
│   ├── next.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔐 Required Files

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cloud-monitoring
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Frontend `jsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 🧪 Testing the Setup

### Backend Health Check

```bash
# Test auth endpoint
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Should return success with token
```

### Frontend Health Check

1. Open http://localhost:3000
2. Open browser DevTools (F12)
3. Check Console - should be no errors
4. Check Network tab - API calls should go to localhost:5000

---

## 🚨 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `Module not found: @/styles/...` | Create `jsconfig.json` (already done) |
| `EADDRINUSE port 5000` | Change port in `.env` |
| `MongoDB connection failed` | Start MongoDB service |
| `401 Unauthorized` | Clear localStorage and login again |
| `Cannot find module` | Run `npm install` |
| `CORS error` | Check backend has `app.use(cors())` |

---

## 📊 Ports Used

| Service | Default Port | Alternative |
|---------|--------------|-------------|
| Backend | 5000 | Set in `.env` |
| Frontend | 3000 | Auto-increments (3001, 3002...) |
| MongoDB | 27017 | Default MongoDB port |

---

## 🔄 Restart Everything

If things aren't working, do a full restart:

```bash
# Stop all servers (Ctrl+C in each terminal)

# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev

# MongoDB (if stopped)
brew services restart mongodb-community
```

---

## 📚 Next Steps

Once running successfully:

1. ✅ Read `API_DOCUMENTATION.md` for all endpoints
2. ✅ Read `API_QUICK_REFERENCE.md` for usage examples
3. ✅ Explore all pages in the UI
4. ✅ Test alert creation and management
5. ✅ Check profile statistics

---

## 🆘 Still Having Issues?

### Check Logs

**Backend logs:**
- Watch terminal where `npm run dev` is running
- Look for error messages

**Frontend logs:**
- Browser DevTools Console (F12)
- Network tab for API call failures

### Verify Dependencies

```bash
# Backend
cd backend
npm list

# Frontend
cd frontend
npm list
```

### Clean Reinstall

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend `.env` file exists with correct values
- [ ] Backend starts without errors on port 5000
- [ ] Frontend `.env.local` file exists
- [ ] Frontend `jsconfig.json` file exists
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can create account and login
- [ ] Can generate sample data
- [ ] Can view all pages (Dashboard, Monitoring, Alerts, Profile, Settings)

---

## 🎉 You're Ready!

If all checks pass, your Multi-Cloud Monitoring Dashboard is ready to use!

**Happy Monitoring!** 🚀

