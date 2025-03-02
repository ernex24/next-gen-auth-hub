
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BarChart3, Users, Eye, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SalesData {
  date: string;
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  purchase_date: string;
  total_revenue: number;
}

const Dashboard = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        console.log("Fetching data for user ID:", user.id);
        
        // Fetch sales data
        const { data: salesData, error: salesError } = await supabase
          .from('sales_data')
          .select('date, amount')
          .order('date', { ascending: true });
        
        if (salesError) {
          console.error('Sales data error:', salesError);
          throw salesError;
        }
        
        console.log("Sales data fetched:", salesData?.length || 0, "records");
        
        // Process sales data for the chart (get last 14 days)
        const processedSalesData = (salesData || [])
          .slice(-14)
          .map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: Number(item.amount)
          }));
        
        setSalesData(processedSalesData);
        
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .order('purchase_date', { ascending: false })
          .limit(5);
        
        if (customersError) {
          console.error('Customers error:', customersError);
          throw customersError;
        }
        
        console.log("Customers fetched:", customersData?.length || 0, "records");
        setCustomers(customersData || []);
        
        // Fetch views count
        const { data: viewsData, error: viewsError } = await supabase
          .from('views_data')
          .select('count')
          .order('date', { ascending: false })
          .limit(1);
        
        if (!viewsError && viewsData && viewsData.length > 0) {
          console.log("Views data:", viewsData[0]);
          setViewsCount(viewsData[0].count);
        } else if (viewsError) {
          console.error('Views data error:', viewsError);
        }
        
        // Fetch active users
        const { data: usersData, error: usersError } = await supabase
          .from('active_users')
          .select('count')
          .order('date', { ascending: false })
          .limit(1);
        
        if (!usersError && usersData && usersData.length > 0) {
          console.log("Active users data:", usersData[0]);
          setActiveUsers(usersData[0].count);
        } else if (usersError) {
          console.error('Active users error:', usersError);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please check the console for details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast, user]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state if no data is available
  if (salesData.length === 0 && customers.length === 0) {
    return (
      <div className="container px-6 py-8 mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
        
        <div className="flex flex-col items-center justify-center mt-16 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <BarChart3 className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No data available</h2>
          <p className="text-muted-foreground max-w-md">
            Your dashboard is ready but there's no data to display yet. Data will appear here once it's available in your database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
      
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesData.length > 0 
                ? formatCurrency(salesData[salesData.length - 1].amount) 
                : formatCurrency(0)}
            </div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>12.5%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subscriptions
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>4.2%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Users Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Now
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Active users right now</span>
            </div>
          </CardContent>
        </Card>

        {/* Page Views Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Page Views
              </CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatLargeNumber(viewsCount)}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              <span>7.3%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      {salesData.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue over time</CardTitle>
              <CardDescription>Daily revenue for the last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="amount" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Recent Customers */}
      {customers.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>Your most recent customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4">{customer.name}</td>
                        <td className="py-3 px-4">{customer.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            customer.subscription_status === 'Subscribed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {customer.subscription_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">${customer.total_revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
