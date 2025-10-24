import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { metricsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

export default function Monitoring() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('aws');
  const [activeTab, setActiveTab] = useState('billing');
  const [billingData, setBillingData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchMetrics();
  }, [selectedProvider, days]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const [billing, resources, performance] = await Promise.all([
        metricsAPI.getBilling(selectedProvider, days),
        metricsAPI.getResources(selectedProvider, days),
        metricsAPI.getPerformance(selectedProvider, days),
      ]);

      if (billing.success) {
        const formatted = billing.data.map(item => ({
          date: new Date(item.timestamp).toLocaleDateString(),
          cost: parseFloat(item.value.toFixed(2)),
        }));
        setBillingData(formatted);
      }

      if (resources.success) {
        const grouped = {};
        resources.data.forEach(item => {
          const date = new Date(item.timestamp).toLocaleDateString();
          if (!grouped[date]) {
            grouped[date] = { date };
          }
          grouped[date][item.metricType] = parseFloat(item.value.toFixed(2));
        });
        setResourceData(Object.values(grouped));
      }

      if (performance.success) {
        const grouped = {};
        performance.data.forEach(item => {
          const date = new Date(item.timestamp).toLocaleDateString();
          if (!grouped[date]) {
            grouped[date] = { date };
          }
          grouped[date][item.metricType] = parseFloat(item.value.toFixed(2));
        });
        setPerformanceData(Object.values(grouped));
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading metrics...</p>
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
            <h1 className="text-3xl font-bold">Monitoring</h1>
            <p className="text-muted-foreground">
              Detailed metrics and performance analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </Select>
            <Select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              <option value="aws">AWS</option>
              <option value="gcp">Google Cloud</option>
              <option value="azure">Azure</option>
              <option value="digitalocean">DigitalOcean</option>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Metrics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="billing"
              active={activeTab === 'billing'}
              onClick={() => setActiveTab('billing')}
            >
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              active={activeTab === 'resources'}
              onClick={() => setActiveTab('resources')}
            >
              Resources
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              active={activeTab === 'performance'}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Cost Trends</CardTitle>
                <CardDescription>
                  Daily billing costs for {selectedProvider.toUpperCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billingData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No billing data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={billingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={2} name="Cost (USD)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>
                  CPU, Memory, and Storage usage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resourceData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No resource data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={resourceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU (%)" />
                      <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory (%)" />
                      <Line type="monotone" dataKey="storage" stroke="#f59e0b" strokeWidth={2} name="Storage (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Latency and throughput measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {performanceData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No performance data available</p>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="latency" fill="#3b82f6" name="Latency (ms)" />
                      <Bar yAxisId="right" dataKey="throughput" fill="#10b981" name="Throughput (req/s)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${billingData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Last {days} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Avg Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resourceData.length > 0
                  ? ((resourceData.reduce((sum, item) => sum + (item.cpu || 0), 0) / resourceData.length).toFixed(1))
                  : '0'}%
              </div>
              <p className="text-xs text-muted-foreground">CPU utilization</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Avg Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {performanceData.length > 0
                  ? ((performanceData.reduce((sum, item) => sum + (item.latency || 0), 0) / performanceData.length).toFixed(0))
                  : '0'}ms
              </div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

