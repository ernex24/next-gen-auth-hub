
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { addDays, subDays, format, isWithinInterval, parseISO } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface SalesData {
  date: string;
  amount: number;
  fullDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  purchase_date: string;
  total_revenue: number;
}

export const useDashboardData = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [allSalesData, setAllSalesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("Starting to fetch dashboard data...");
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        if (!user) {
          console.log("No authenticated user found!");
          setDebugInfo("No authenticated user found. Please sign in to view dashboard data.");
          setLoading(false);
          return;
        }
        
        console.log("Fetching data for user ID:", user.id);
        
        // Fetch sales data
        const salesResult = await supabase
          .from('sales_data')
          .select('date, amount')
          .order('date', { ascending: true });
        
        if (salesResult.error) {
          console.error('Sales data error:', salesResult.error);
          setDebugInfo(`Sales data error: ${salesResult.error.message}`);
        } else {
          console.log("Sales data fetched:", salesResult.data?.length || 0, "records");
          
          if (salesResult.data && salesResult.data.length > 0) {
            // Process sales data for the chart
            const processedSalesData = salesResult.data.map(item => ({
              date: format(new Date(item.date), 'MMM d'),
              amount: Number(item.amount),
              fullDate: item.date
            }));
            
            setAllSalesData(processedSalesData);
            // Set initial data to all data
            setSalesData(processedSalesData);
            console.log("Processed sales data:", processedSalesData);
          } else {
            console.log("No sales data found");
            setDebugInfo(debugInfo => `${debugInfo || ""}\nNo sales data found in database`);
          }
        }
        
        // Fetch customers
        const customersResult = await supabase
          .from('customers')
          .select('*')
          .order('purchase_date', { ascending: false });
        
        if (customersResult.error) {
          console.error('Customers error:', customersResult.error);
          setDebugInfo(debugInfo => `${debugInfo || ""}\nCustomers error: ${customersResult.error.message}`);
        } else {
          console.log("Customers fetched:", customersResult.data?.length || 0, "records");
          
          if (customersResult.data && customersResult.data.length > 0) {
            setAllCustomers(customersResult.data);
            // Set initial customers to all customers (limit to top 5)
            setCustomers(customersResult.data.slice(0, 5));
            console.log("Customer data:", customersResult.data);
          } else {
            console.log("No customers found");
            setDebugInfo(debugInfo => `${debugInfo || ""}\nNo customers found in database`);
          }
        }
        
        // Fetch views count
        const viewsResult = await supabase
          .from('views_data')
          .select('count')
          .order('date', { ascending: false })
          .limit(1);
        
        if (viewsResult.error) {
          console.error('Views data error:', viewsResult.error);
          setDebugInfo(debugInfo => `${debugInfo || ""}\nViews data error: ${viewsResult.error.message}`);
        } else if (viewsResult.data && viewsResult.data.length > 0) {
          console.log("Views data:", viewsResult.data[0]);
          setViewsCount(viewsResult.data[0].count);
        } else {
          console.log("No views data found");
          setDebugInfo(debugInfo => `${debugInfo || ""}\nNo views data found in database`);
        }
        
        // Fetch active users
        const usersResult = await supabase
          .from('active_users')
          .select('count')
          .order('date', { ascending: false })
          .limit(1);
        
        if (usersResult.error) {
          console.error('Active users error:', usersResult.error);
          setDebugInfo(debugInfo => `${debugInfo || ""}\nActive users error: ${usersResult.error.message}`);
        } else if (usersResult.data && usersResult.data.length > 0) {
          console.log("Active users data:", usersResult.data[0]);
          setActiveUsers(usersResult.data[0].count);
        } else {
          console.log("No active users data found");
          setDebugInfo(debugInfo => `${debugInfo || ""}\nNo active users data found in database`);
        }
        
        console.log("All dashboard data fetched successfully");
        // Force loading to false even if we have some errors
        // This way the dashboard can still render with partial data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        let errorMessage = 'Failed to load dashboard data. Please check the console for details.';
        if (error instanceof Error) errorMessage += ` Error: ${error.message}`;
        
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try refreshing the page.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast, user]);

  useEffect(() => {
    if (isDateFilterActive && dateRange?.from && dateRange?.to && allSalesData.length > 0) {
      try {
        console.log("Filtering data for date range:", dateRange.from, "to", dateRange.to);
        
        const filteredSalesData = allSalesData.filter(item => {
          if (!item.fullDate) return false;
          const itemDate = parseISO(item.fullDate);
          return isWithinInterval(itemDate, { 
            start: dateRange.from!, 
            end: dateRange.to! 
          });
        }).map(({ date, amount }) => ({ date, amount }));
        
        console.log("Filtered sales data:", filteredSalesData.length, "records");
        setSalesData(filteredSalesData);
        
        const filteredCustomers = allCustomers.filter(customer => {
          const purchaseDate = parseISO(customer.purchase_date);
          return isWithinInterval(purchaseDate, { 
            start: dateRange.from!, 
            end: dateRange.to! 
          });
        }).slice(0, 5);
        
        console.log("Filtered customers:", filteredCustomers.length, "records");
        setCustomers(filteredCustomers);
      } catch (err) {
        console.error("Error filtering by date range:", err);
        // Continue with unfiltered data if there's an error
        setSalesData(allSalesData.map(({ date, amount }) => ({ date, amount })));
        setCustomers(allCustomers.slice(0, 5));
      }
    } else if (!isDateFilterActive && allSalesData.length > 0) {
      // When date filter is turned off, show all data
      setSalesData(allSalesData);
      setCustomers(allCustomers.slice(0, 5));
    }
  }, [dateRange, allSalesData, allCustomers, isDateFilterActive]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // If a date range is selected, activate filtering
    if (range?.from && range?.to) {
      setIsDateFilterActive(true);
    }
  };

  const toggleDateFilter = (active: boolean) => {
    setIsDateFilterActive(active);
  };

  return {
    salesData,
    customers,
    viewsCount,
    activeUsers,
    loading,
    error,
    debugInfo,
    dateRange,
    isDateFilterActive,
    handleDateRangeChange,
    toggleDateFilter,
    hasAnyData: allSalesData.length > 0 || allCustomers.length > 0 || viewsCount > 0 || activeUsers > 0
  };
};
