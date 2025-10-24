# Deployment Checklist

Complete checklist for deploying the Multi-Cloud Monitoring Dashboard.

---

## ✅ Pre-Deployment Checklist

### Backend Preparation

- [ ] **Environment Variables**
  - [ ] `PORT` set correctly
  - [ ] `MONGODB_URI` pointing to production database
  - [ ] `JWT_SECRET` is a strong, random string (min 32 characters)
  - [ ] `JWT_EXPIRE` set appropriately
  - [ ] `NODE_ENV=production`

- [ ] **Database**
  - [ ] MongoDB Atlas cluster created (or production DB ready)
  - [ ] Database user created with appropriate permissions
  - [ ] IP whitelist configured
  - [ ] Connection string tested

- [ ] **Security**
  - [ ] CORS configured for production frontend URL
  - [ ] Rate limiting implemented (if needed)
  - [ ] Input validation on all endpoints
  - [ ] Helmet.js installed for security headers (optional)

- [ ] **Code Quality**
  - [ ] All console.logs reviewed
  - [ ] Error handling in place
  - [ ] No hardcoded credentials
  - [ ] .env in .gitignore

### Frontend Preparation

- [ ] **Environment Variables**
  - [ ] `NEXT_PUBLIC_API_URL` set to production backend URL

- [ ] **Build**
  - [ ] `npm run build` completes successfully
  - [ ] No build warnings
  - [ ] All pages accessible

- [ ] **Configuration**
  - [ ] `jsconfig.json` exists
  - [ ] `next.config.js` configured
  - [ ] `tailwind.config.js` configured

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Heroku (Backend)

#### Frontend on Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Import GitHub repository
   - Set environment variable:
     - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.com/api`
   - Deploy

3. **Verify**
   - [ ] Frontend accessible
   - [ ] No console errors
   - [ ] Can reach login page

#### Backend on Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Connect GitHub

2. **Create New Project**
   - Import backend repository
   - Add environment variables:
     - `PORT`: 5000
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Strong random string
     - `JWT_EXPIRE`: 7d
     - `NODE_ENV`: production

3. **Deploy**
   - Railway auto-deploys
   - Get your backend URL

4. **Update Frontend**
   - Update Vercel environment variable
   - `NEXT_PUBLIC_API_URL`: `https://your-railway-url.railway.app/api`
   - Redeploy frontend

### Option 2: All on Heroku

#### Backend

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
cd backend
heroku create your-app-name-backend

# Set environment variables
heroku config:set PORT=5000
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set JWT_EXPIRE=7d
heroku config:set NODE_ENV=production

# Add Procfile
echo "web: node server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a your-app-name-backend
git push heroku main

# Verify
heroku open
heroku logs --tail
```

#### Frontend

```bash
cd frontend

# Create Heroku app
heroku create your-app-name-frontend

# Set environment
heroku config:set NEXT_PUBLIC_API_URL="https://your-app-name-backend.herokuapp.com/api"

# Add Procfile
echo "web: npm start" > Procfile

# Update package.json scripts
# Ensure "start": "next start" exists

# Build and deploy
npm run build
git add .
git commit -m "Deploy frontend"
git push heroku main
```

### Option 3: VPS (AWS EC2, DigitalOcean, etc.)

#### Backend

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (or use Atlas)
# See: https://docs.mongodb.com/manual/installation/

# Clone repository
git clone YOUR_REPO_URL
cd cloud/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add production values

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start server.js --name cloud-backend
pm2 save
pm2 startup

# Setup nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/backend
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Frontend

Similar process, but run:
```bash
npm run build
pm2 start npm --name cloud-frontend -- start
```

---

## 🔒 Security Checklist

### Backend

- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB connection uses authentication
- [ ] CORS restricted to frontend URL
- [ ] Environment variables not in code
- [ ] HTTPS enabled
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection

### Frontend

- [ ] API URL uses HTTPS
- [ ] No sensitive data in localStorage
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] No API keys in client code

---

## 📊 Monitoring & Logging

### Set Up

- [ ] **Backend Logging**
  - Winston or similar logging library
  - Log errors to file/service
  - Monitor API response times

- [ ] **Frontend Monitoring**
  - Google Analytics (optional)
  - Sentry for error tracking (optional)
  - Monitor page load times

- [ ] **Database Monitoring**
  - MongoDB Atlas monitoring
  - Set up alerts for high usage
  - Backup strategy in place

---

## 🧪 Post-Deployment Testing

### Smoke Tests

- [ ] **Frontend**
  - [ ] Can access homepage
  - [ ] Can navigate to login
  - [ ] No console errors

- [ ] **Backend**
  - [ ] Health check endpoint responds
  - [ ] Can create account
  - [ ] Can login
  - [ ] Can fetch dashboard data

### Full Test Suite

- [ ] **Authentication**
  - [ ] Signup with new user
  - [ ] Login with credentials
  - [ ] JWT token works
  - [ ] Logout works

- [ ] **Dashboard**
  - [ ] Loads without errors
  - [ ] Can generate sample data
  - [ ] Metrics display correctly
  - [ ] Filtering works

- [ ] **Monitoring**
  - [ ] Charts render
  - [ ] Data fetches correctly
  - [ ] Provider switching works
  - [ ] Date range selection works

- [ ] **Alerts**
  - [ ] Can view alerts
  - [ ] Can create alert
  - [ ] Can resolve alert
  - [ ] Can delete alert

- [ ] **Profile**
  - [ ] Statistics load
  - [ ] User info displays
  - [ ] Connected providers show

- [ ] **Settings**
  - [ ] Can update profile
  - [ ] Can change password
  - [ ] Can update alert settings
  - [ ] Cloud provider config saves

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test
      # Add deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      # Add deployment steps
```

---

## 📝 Environment Variables

### Backend (.env)

```env
# Production values
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloud-monitoring
JWT_SECRET=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING_MIN_32_CHARS
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend (.env.local or Vercel environment)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## 🚨 Rollback Plan

If deployment fails:

1. **Keep previous version running**
2. **Test new version separately**
3. **Database migrations reversible**
4. **Have backup of environment variables**

### Quick Rollback

```bash
# Heroku
heroku rollback

# Vercel
vercel rollback

# PM2
pm2 restart cloud-backend --update-env
```

---

## 📞 Support & Maintenance

### Regular Tasks

- [ ] Weekly database backups
- [ ] Monthly dependency updates
- [ ] Monitor server resources
- [ ] Review error logs
- [ ] Check security advisories

### Performance Monitoring

- [ ] API response times < 200ms
- [ ] Page load times < 3s
- [ ] Database query optimization
- [ ] CDN for static assets (optional)

---

## ✅ Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and working
- [ ] All environment variables set
- [ ] HTTPS enabled on both
- [ ] Smoke tests pass
- [ ] Full test suite passes
- [ ] Monitoring/logging configured
- [ ] Documentation updated
- [ ] Team notified

---

## 🎉 Deployment Complete!

Your Multi-Cloud Monitoring Dashboard is now live in production!

**URLs:**
- Frontend: `https://your-frontend-url.com`
- Backend: `https://your-backend-url.com`
- Database: `MongoDB Atlas`

**Next Steps:**
1. Monitor logs for first 24 hours
2. Test with real users
3. Collect feedback
4. Plan next features

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

