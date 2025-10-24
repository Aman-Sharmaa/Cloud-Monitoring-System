import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { usersAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

export default function Alerts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchAlerts();
  }, [activeTab]);

  const fetchAlerts = async () => {
    try {
      setError('');
      const resolved = activeTab === 'resolved' ? true : activeTab === 'active' ? false : null;
      const response = await usersAPI.getAlerts(resolved);
      if (response.success) {
        setAlerts(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const handleResolve = async (alertId) => {
    try {
      setError('');
      setSuccess('');
      const response = await usersAPI.resolveAlert(alertId);
      if (response.success) {
        setSuccess('Alert resolved successfully');
        fetchAlerts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve alert');
    }
  };

  const handleDelete = async (alertId) => {
    if (!confirm('Are you sure you want to delete this alert?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      const response = await usersAPI.deleteAlert(alertId);
      if (response.success) {
        setSuccess('Alert deleted successfully');
        fetchAlerts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete alert');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
      case 'low':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading alerts...</p>
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
            <h1 className="text-3xl font-bold">Alerts</h1>
            <p className="text-muted-foreground">
              Manage and monitor your cloud infrastructure alerts
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

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Alerts Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="active"
              active={activeTab === 'active'}
              onClick={() => setActiveTab('active')}
            >
              Active Alerts
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              active={activeTab === 'resolved'}
              onClick={() => setActiveTab('resolved')}
            >
              Resolved Alerts
            </TabsTrigger>
            <TabsTrigger
              value="all"
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            >
              All Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {activeTab === 'active' && 'Active Alerts'}
                  {activeTab === 'resolved' && 'Resolved Alerts'}
                  {activeTab === 'all' && 'All Alerts'}
                </CardTitle>
                <CardDescription>
                  {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No alerts found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Threshold</TableHead>
                        <TableHead>Current</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow key={alert._id}>
                          <TableCell className="font-medium capitalize">
                            {alert.provider}
                          </TableCell>
                          <TableCell className="capitalize">
                            {alert.alertType}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {alert.message}
                          </TableCell>
                          <TableCell>{alert.threshold}</TableCell>
                          <TableCell className="font-semibold">
                            {alert.currentValue}
                          </TableCell>
                          <TableCell>
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {!alert.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResolve(alert._id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(alert._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.severity === 'critical').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {alerts.filter(a => !a.resolved).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

