# Cloud Monitoring - Frontend

Next.js application for the Multi-Cloud Monitoring Dashboard with ShadCN UI components.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Pages

### Public Pages
- `/` - Home (redirects to login or dashboard)
- `/login` - User login
- `/signup` - User registration

### Protected Pages
- `/dashboard` - Main dashboard with metrics overview
- `/monitoring` - Detailed metrics and charts
- `/settings` - User settings and cloud provider configuration

## Components

### UI Components (ShadCN)
- `Button` - Styled button with variants
- `Card` - Card container with header, content, footer
- `Input` - Form input field
- `Label` - Form label
- `Select` - Dropdown select
- `Tabs` - Tabbed interface
- `Alert` - Alert messages
- `Table` - Data table

### Layout Components
- `Layout` - Main layout with header, footer, navigation
- `ThemeProvider` - Dark/light theme context

## Features

### Authentication
- JWT token stored in localStorage
- Automatic redirect to login if not authenticated
- Logout functionality

### Dashboard
- Aggregated metrics cards
- Provider filtering
- Recent alerts
- Sample data generation
- Auto-refresh

### Monitoring
- Interactive charts with Recharts
- Multiple tabs (Billing, Resources, Performance)
- Provider selection
- Date range selection (7, 14, 30 days)
- Summary statistics

### Settings
- Profile management
- Password change
- Alert threshold configuration
- Cloud provider connections
  - AWS (Access Key, Secret Key, Region)
  - GCP (Project ID, Service Account)
  - Azure (Subscription, Tenant IDs)
  - DigitalOcean (API Token)

### Theme
- Light and dark mode
- Toggle in header
- Persisted preference
- Smooth transitions

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme customization
- **Dark Mode**: Class-based dark mode
- **Responsive**: Mobile-first design

## API Integration

The frontend communicates with the backend API using Axios:

```javascript
import { authAPI, metricsAPI, usersAPI } from '@/lib/api';

// Authentication
await authAPI.login({ email, password });
await authAPI.signup({ name, email, password });

// Metrics
await metricsAPI.getDashboard('aws');
await metricsAPI.getBilling('aws', 7);
await metricsAPI.seedMetrics();

// User
await usersAPI.getProfile();
await usersAPI.updateSettings({ alertSettings });
```

## Chart Components

Uses Recharts for data visualization:
- `LineChart` - Trend analysis
- `BarChart` - Comparison metrics
- `ResponsiveContainer` - Responsive sizing
- `Tooltip` - Interactive data points
- `Legend` - Chart legends

## State Management

Uses React hooks for state management:
- `useState` - Component state
- `useEffect` - Side effects and data fetching
- `useRouter` - Next.js navigation
- `useTheme` - Theme management

## Navigation

- Header navigation with active states
- Responsive mobile menu
- Protected route checks
- Automatic redirects

## Error Handling

- API error messages displayed
- Form validation
- Loading states
- Success notifications

## Responsive Design

- Mobile: Single column layout
- Tablet: Two column layout
- Desktop: Multi-column layout
- Flexible charts and tables

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM rendering

### UI & Styling
- `tailwindcss` - CSS framework
- `class-variance-authority` - Component variants
- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `lucide-react` - Icon library
- `next-themes` - Theme management

### Charts & Visualization
- `recharts` - Chart library

### API & Data
- `axios` - HTTP client

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # ShadCN UI components
│   │   ├── Layout.jsx       # Main layout
│   │   └── ThemeProvider.jsx
│   ├── lib/
│   │   ├── api.js           # API client
│   │   └── utils.js         # Utility functions
│   ├── pages/
│   │   ├── _app.js          # Next.js app wrapper
│   │   ├── index.js         # Home page
│   │   ├── login.js         # Login page
│   │   ├── signup.js        # Signup page
│   │   ├── dashboard.js     # Dashboard page
│   │   ├── monitoring.js    # Monitoring page
│   │   └── settings.js      # Settings page
│   └── styles/
│       └── globals.css      # Global styles
├── next.config.js
├── tailwind.config.js
└── package.json
```

