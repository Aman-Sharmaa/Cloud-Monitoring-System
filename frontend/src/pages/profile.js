import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { usersAPI, authAPI, metricsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, User, Database, Bell, Cloud, TrendingUp } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setError('');
      
      // Fetch user data and stats in parallel
      const [userResponse, statsResponse] = await Promise.all([
        authAPI.getMe(),
        usersAPI.getStats(),
      ]);

      if (userResponse.success) {
        setUserData(userResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleClearMetrics = async () => {
    if (!confirm('Are you sure you want to clear all metrics? This action cannot be undone.')) {
      return;
    }

    try {
      setRefreshing(true);
      const response = await metricsAPI.clearMetrics();
      if (response.success) {
        alert(`Successfully cleared ${response.deletedCount} metrics`);
        fetchProfileData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear metrics');
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Profile & Statistics</h1>
            <p className="text-muted-foreground">
              Your account information and usage statistics
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            {userData && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Theme</p>
                  <p className="text-lg font-semibold capitalize">{userData.theme}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                  <p className="text-lg font-semibold">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.metricsCount}</div>
                  <p className="text-xs text-muted-foreground">Data points tracked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.alertsCount}</div>
                  <p className="text-xs text-muted-foreground">Alerts generated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unresolved Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.unresolvedAlertsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Connected Providers</CardTitle>
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.connectedProvidersCount}</div>
                  <p className="text-xs text-muted-foreground">Cloud platforms</p>
                </CardContent>
              </Card>
            </div>

            {/* Connected Providers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Connected Cloud Providers
                </CardTitle>
                <CardDescription>
                  Cloud platforms currently monitored
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats.connectedProviders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No cloud providers connected yet. Go to Settings to connect your accounts.
                  </p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {stats.connectedProviders.map((provider) => (
                      <div
                        key={provider}
                        className="flex items-center justify-center p-4 border rounded-lg bg-primary/5"
                      >
                        <span className="font-medium capitalize">{provider}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Alert Settings */}
        {userData?.alertSettings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Alert Thresholds
              </CardTitle>
              <CardDescription>Your configured alert limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Cost</p>
                  <p className="text-2xl font-bold">${userData.alertSettings.costThreshold}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">CPU</p>
                  <p className="text-2xl font-bold">{userData.alertSettings.cpuThreshold}%</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Memory</p>
                  <p className="text-2xl font-bold">{userData.alertSettings.memoryThreshold}%</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Storage</p>
                  <p className="text-2xl font-bold">{userData.alertSettings.storageThreshold}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={userData.alertSettings.notificationsEnabled}
                    disabled
                    className="h-4 w-4"
                  />
                  <span className="text-sm">
                    Notifications {userData.alertSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your metrics and data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/settings')}
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => metricsAPI.seedMetrics().then(() => {
                  alert('Sample data generated successfully!');
                  fetchProfileData();
                })}
              >
                Generate Sample Data
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearMetrics}
              >
                Clear All Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

