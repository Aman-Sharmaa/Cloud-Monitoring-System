import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { usersAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Lock, Bell, Cloud, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

export default function Settings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Alert settings state
  const [alertSettings, setAlertSettings] = useState({
    costThreshold: 1000,
    cpuThreshold: 80,
    memoryThreshold: 80,
    storageThreshold: 90,
    notificationsEnabled: true,
  });

  // Cloud providers state
  const [cloudProviders, setCloudProviders] = useState({
    aws: {
      connected: false,
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
    },
    gcp: {
      connected: false,
      projectId: '',
      serviceAccountKey: '',
    },
    azure: {
      connected: false,
      subscriptionId: '',
      tenantId: '',
      clientId: '',
      clientSecret: '',
    },
    digitalocean: {
      connected: false,
      apiToken: '',
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      if (response.success) {
        const userData = response.data;
        setProfile({
          name: userData.name,
          email: userData.email,
        });
        setAlertSettings(userData.alertSettings || alertSettings);
        setCloudProviders(userData.cloudProviders || cloudProviders);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await usersAPI.updateProfile(profile);
      if (response.success) {
        setSuccess('Profile updated successfully');
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...user, ...profile }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await usersAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.success) {
        setSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleAlertSettingsUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await usersAPI.updateSettings({ alertSettings });
      if (response.success) {
        setSuccess('Alert settings updated successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update alert settings');
    }
  };

  const handleCloudProviderUpdate = async (provider) => {
    setError('');
    setSuccess('');

    try {
      const response = await usersAPI.updateSettings({ cloudProviders });
      if (response.success) {
        setSuccess(`${provider.toUpperCase()} configuration updated successfully`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cloud provider settings');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'alerts', label: 'Alert Settings', icon: Bell },
    { id: 'providers', label: 'Cloud Providers', icon: Cloud },
  ];

  const providers = [
    { id: 'aws', name: 'Amazon Web Services', color: 'bg-orange-500' },
    { id: 'gcp', name: 'Google Cloud Platform', color: 'bg-blue-500' },
    { id: 'azure', name: 'Microsoft Azure', color: 'bg-cyan-500' },
    { id: 'digitalocean', name: 'DigitalOcean', color: 'bg-blue-600' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and cloud provider connections
          </p>
        </div>

        {success && (
          <Alert>
            <AlertDescription className="text-green-600 dark:text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 p-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setSelectedProvider(null);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Update Profile</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Alerts Section */}
            {activeSection === 'alerts' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Alert Thresholds
                  </CardTitle>
                  <CardDescription>Configure when you receive alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAlertSettingsUpdate} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="costThreshold">Cost Threshold (USD)</Label>
                        <Input
                          id="costThreshold"
                          type="number"
                          value={alertSettings.costThreshold}
                          onChange={(e) => setAlertSettings({ ...alertSettings, costThreshold: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpuThreshold">CPU Threshold (%)</Label>
                        <Input
                          id="cpuThreshold"
                          type="number"
                          value={alertSettings.cpuThreshold}
                          onChange={(e) => setAlertSettings({ ...alertSettings, cpuThreshold: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memoryThreshold">Memory Threshold (%)</Label>
                        <Input
                          id="memoryThreshold"
                          type="number"
                          value={alertSettings.memoryThreshold}
                          onChange={(e) => setAlertSettings({ ...alertSettings, memoryThreshold: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="storageThreshold">Storage Threshold (%)</Label>
                        <Input
                          id="storageThreshold"
                          type="number"
                          value={alertSettings.storageThreshold}
                          onChange={(e) => setAlertSettings({ ...alertSettings, storageThreshold: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <input
                        type="checkbox"
                        id="notificationsEnabled"
                        checked={alertSettings.notificationsEnabled}
                        onChange={(e) => setAlertSettings({ ...alertSettings, notificationsEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="notificationsEnabled" className="cursor-pointer">
                        Enable Notifications
                      </Label>
                    </div>
                    <Button type="submit">Update Alert Settings</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Cloud Providers Section */}
            {activeSection === 'providers' && (
              <div className="space-y-6">
                {!selectedProvider ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cloud className="h-5 w-5" />
                        Cloud Providers
                      </CardTitle>
                      <CardDescription>
                        Select a cloud provider to configure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {providers.map((provider) => {
                          const isConnected = cloudProviders[provider.id]?.connected;
                          return (
                            <button
                              key={provider.id}
                              onClick={() => setSelectedProvider(provider.id)}
                              className="flex items-center justify-between p-6 border-2 rounded-lg hover:border-primary transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${provider.color} flex items-center justify-center`}>
                                  <Cloud className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-left">
                                  <p className="font-semibold">{provider.name}</p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    {isConnected ? (
                                      <>
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        <span className="text-green-600">Connected</span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-3 w-3 text-gray-400" />
                                        <span>Not Connected</span>
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedProvider(null)}
                      className="mb-4"
                    >
                      ← Back to all providers
                    </Button>

                    {/* AWS Config */}
                    {selectedProvider === 'aws' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                                <Cloud className="h-5 w-5 text-white" />
                              </div>
                              <span>Amazon Web Services</span>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${cloudProviders.aws.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                              {cloudProviders.aws.connected ? '✓ Connected' : '○ Not Connected'}
                            </span>
                          </CardTitle>
                          <CardDescription>Configure your AWS credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Access Key ID</Label>
                            <Input
                              type="password"
                              value={cloudProviders.aws.accessKeyId}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                aws: { ...cloudProviders.aws, accessKeyId: e.target.value }
                              })}
                              placeholder="AKIA..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Secret Access Key</Label>
                            <Input
                              type="password"
                              value={cloudProviders.aws.secretAccessKey}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                aws: { ...cloudProviders.aws, secretAccessKey: e.target.value }
                              })}
                              placeholder="Enter AWS Secret Access Key"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Region</Label>
                            <Input
                              value={cloudProviders.aws.region}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                aws: { ...cloudProviders.aws, region: e.target.value }
                              })}
                              placeholder="us-east-1"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => {
                                setCloudProviders({
                                  ...cloudProviders,
                                  aws: { ...cloudProviders.aws, connected: !cloudProviders.aws.connected }
                                });
                                handleCloudProviderUpdate('aws');
                              }}
                              variant={cloudProviders.aws.connected ? 'destructive' : 'default'}
                            >
                              {cloudProviders.aws.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                            <Button variant="outline" onClick={() => handleCloudProviderUpdate('aws')}>
                              Save Configuration
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* GCP Config */}
                    {selectedProvider === 'gcp' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                <Cloud className="h-5 w-5 text-white" />
                              </div>
                              <span>Google Cloud Platform</span>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${cloudProviders.gcp.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                              {cloudProviders.gcp.connected ? '✓ Connected' : '○ Not Connected'}
                            </span>
                          </CardTitle>
                          <CardDescription>Configure your GCP credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Project ID</Label>
                            <Input
                              value={cloudProviders.gcp.projectId}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                gcp: { ...cloudProviders.gcp, projectId: e.target.value }
                              })}
                              placeholder="my-project-123"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Service Account Key (JSON)</Label>
                            <Input
                              type="password"
                              value={cloudProviders.gcp.serviceAccountKey}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                gcp: { ...cloudProviders.gcp, serviceAccountKey: e.target.value }
                              })}
                              placeholder="Paste service account key JSON"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => {
                                setCloudProviders({
                                  ...cloudProviders,
                                  gcp: { ...cloudProviders.gcp, connected: !cloudProviders.gcp.connected }
                                });
                                handleCloudProviderUpdate('gcp');
                              }}
                              variant={cloudProviders.gcp.connected ? 'destructive' : 'default'}
                            >
                              {cloudProviders.gcp.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                            <Button variant="outline" onClick={() => handleCloudProviderUpdate('gcp')}>
                              Save Configuration
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Azure Config */}
                    {selectedProvider === 'azure' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                                <Cloud className="h-5 w-5 text-white" />
                              </div>
                              <span>Microsoft Azure</span>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${cloudProviders.azure.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                              {cloudProviders.azure.connected ? '✓ Connected' : '○ Not Connected'}
                            </span>
                          </CardTitle>
                          <CardDescription>Configure your Azure credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Subscription ID</Label>
                            <Input
                              value={cloudProviders.azure.subscriptionId}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                azure: { ...cloudProviders.azure, subscriptionId: e.target.value }
                              })}
                              placeholder="00000000-0000-0000-0000-000000000000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tenant ID</Label>
                            <Input
                              value={cloudProviders.azure.tenantId}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                azure: { ...cloudProviders.azure, tenantId: e.target.value }
                              })}
                              placeholder="Enter Azure Tenant ID"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => {
                                setCloudProviders({
                                  ...cloudProviders,
                                  azure: { ...cloudProviders.azure, connected: !cloudProviders.azure.connected }
                                });
                                handleCloudProviderUpdate('azure');
                              }}
                              variant={cloudProviders.azure.connected ? 'destructive' : 'default'}
                            >
                              {cloudProviders.azure.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                            <Button variant="outline" onClick={() => handleCloudProviderUpdate('azure')}>
                              Save Configuration
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* DigitalOcean Config */}
                    {selectedProvider === 'digitalocean' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Cloud className="h-5 w-5 text-white" />
                              </div>
                              <span>DigitalOcean</span>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${cloudProviders.digitalocean.connected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                              {cloudProviders.digitalocean.connected ? '✓ Connected' : '○ Not Connected'}
                            </span>
                          </CardTitle>
                          <CardDescription>Configure your DigitalOcean credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>API Token</Label>
                            <Input
                              type="password"
                              value={cloudProviders.digitalocean.apiToken}
                              onChange={(e) => setCloudProviders({
                                ...cloudProviders,
                                digitalocean: { ...cloudProviders.digitalocean, apiToken: e.target.value }
                              })}
                              placeholder="Enter DigitalOcean API Token"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={() => {
                                setCloudProviders({
                                  ...cloudProviders,
                                  digitalocean: { ...cloudProviders.digitalocean, connected: !cloudProviders.digitalocean.connected }
                                });
                                handleCloudProviderUpdate('digitalocean');
                              }}
                              variant={cloudProviders.digitalocean.connected ? 'destructive' : 'default'}
                            >
                              {cloudProviders.digitalocean.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                            <Button variant="outline" onClick={() => handleCloudProviderUpdate('digitalocean')}>
                              Save Configuration
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
