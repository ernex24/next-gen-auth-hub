
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BarChart3, Users, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import our new components
import StatCard from './dashboard/StatCard';
import RevenueChart from './dashboard/RevenueChart';
import CustomersTable from './dashboard/CustomersTable';
import LoadingState from './dashboard/LoadingState';
import EmptyState from './dashboard/EmptyState';
import { formatCurrency, formatLargeNumber } from './dashboard/utils';

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

  if (loading) {
    return <LoadingState />;
  }

  // Show empty state if no data is available
  if (salesData.length === 0 && customers.length === 0) {
    return (
      <div className="container px-6 py-8 mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
      
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <StatCard 
          title="Revenue" 
          value={salesData.length > 0 ? formatCurrency(salesData[salesData.length - 1].amount) : formatCurrency(0)}
          icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />}
          percentageChange={12.5}
        />

        {/* Subscriptions Card */}
        <StatCard 
          title="Subscriptions" 
          value={customers.length}
          icon={<Users className="w-4 h-4 text-muted-foreground" />}
          percentageChange={4.2}
        />

        {/* Active Users Card */}
        <StatCard 
          title="Active Now" 
          value={activeUsers}
          icon={<Users className="w-4 h-4 text-muted-foreground" />}
          subtitle="Active users right now"
        />

        {/* Page Views Card */}
        <StatCard 
          title="Page Views" 
          value={formatLargeNumber(viewsCount)}
          icon={<Eye className="w-4 h-4 text-muted-foreground" />}
          percentageChange={7.3}
        />
      </div>
      
      {/* Charts */}
      {salesData.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mt-8">
          <RevenueChart salesData={salesData} formatCurrency={formatCurrency} />
        </div>
      )}
      
      {/* Recent Customers */}
      {customers.length > 0 && (
        <div className="mt-8">
          <CustomersTable customers={customers} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
