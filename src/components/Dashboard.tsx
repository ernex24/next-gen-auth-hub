
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { BarChart3, Users, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { addDays, subDays, format, isWithinInterval, parseISO } from 'date-fns';

// Import our components
import StatCard from './dashboard/StatCard';
import RevenueChart from './dashboard/RevenueChart';
import CustomersTable from './dashboard/CustomersTable';
import LoadingState from './dashboard/LoadingState';
import EmptyState from './dashboard/EmptyState';
import { DateRangePicker } from './dashboard/DateRangePicker';
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
  const [allSalesData, setAllSalesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  });
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
        
        // Process sales data for the chart
        const processedSalesData = (salesData || [])
          .map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            amount: Number(item.amount),
            fullDate: item.date // Keep the full date for filtering
          }));
        
        setAllSalesData(processedSalesData);
        
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .order('purchase_date', { ascending: false });
        
        if (customersError) {
          console.error('Customers error:', customersError);
          throw customersError;
        }
        
        console.log("Customers fetched:", customersData?.length || 0, "records");
        setAllCustomers(customersData || []);
        
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

  // Filter data whenever the date range changes
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Filter sales data based on date range
      const filteredSalesData = allSalesData.filter(item => {
        const itemDate = parseISO(item.fullDate);
        return isWithinInterval(itemDate, { 
          start: dateRange.from!, 
          end: dateRange.to! 
        });
      }).map(({ date, amount }) => ({ date, amount })); // Remove fullDate from the filtered data
      
      setSalesData(filteredSalesData);
      
      // Filter customers based on date range
      const filteredCustomers = allCustomers.filter(customer => {
        const purchaseDate = parseISO(customer.purchase_date);
        return isWithinInterval(purchaseDate, { 
          start: dateRange.from!, 
          end: dateRange.to! 
        });
      }).slice(0, 5); // Only take the first 5 for display
      
      setCustomers(filteredCustomers);
    }
  }, [dateRange, allSalesData, allCustomers]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  if (loading) {
    return <LoadingState />;
  }

  // Show empty state if no data is available
  if (allSalesData.length === 0 && allCustomers.length === 0) {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
        </div>
        <div className="mt-4 md:mt-0">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={handleDateRangeChange} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <StatCard 
          title="Revenue" 
          value={salesData.length > 0 
            ? formatCurrency(salesData.reduce((sum, item) => sum + item.amount, 0)) 
            : formatCurrency(0)}
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
      
      {/* Empty state if filtered data is empty */}
      {salesData.length === 0 && customers.length === 0 && (
        <div className="mt-8">
          <EmptyState message="No data found for the selected date range." />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
