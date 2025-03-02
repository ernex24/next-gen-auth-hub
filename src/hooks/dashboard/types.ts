
import { DateRange } from 'react-day-picker';

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

export interface DashboardData {
  salesData: SalesData[];
  customers: Customer[];
  viewsCount: number;
  activeUsers: number;
  loading: boolean;
  error: string | null;
  debugInfo: string | null;
  dateRange: DateRange | undefined;
  isDateFilterActive: boolean;
  handleDateRangeChange: (range: DateRange | undefined) => void;
  toggleDateFilter: (active: boolean) => void;
  hasAnyData: boolean;
}
