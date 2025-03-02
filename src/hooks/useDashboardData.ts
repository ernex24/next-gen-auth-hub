
import { useDashboardFetch } from './dashboard/useDashboardFetch';
import { useDateFilter } from './dashboard/useDateFilter';
import { DashboardData } from './dashboard/types';

export type { SalesData, Customer } from './dashboard/types';

export const useDashboardData = (): DashboardData => {
  const {
    allSalesData,
    allCustomers,
    viewsCount,
    activeUsers,
    loading,
    error,
    debugInfo,
    hasAnyData
  } = useDashboardFetch();

  const {
    salesData,
    customers,
    dateRange,
    isDateFilterActive,
    handleDateRangeChange,
    toggleDateFilter
  } = useDateFilter(allSalesData, allCustomers);

  // Additional debug information to help diagnose issues
  const combinedDebugInfo = debugInfo ? 
    `${debugInfo}\n\nDate filter active: ${isDateFilterActive}\nDate range: ${
      dateRange?.from ? dateRange.from.toISOString().slice(0, 10) : 'none'
    } to ${
      dateRange?.to ? dateRange.to.toISOString().slice(0, 10) : 'none'
    }\nSales data: ${salesData.length}/${allSalesData.length} records\nCustomers: ${customers.length}/${allCustomers.length} records` 
    : null;

  return {
    salesData,
    customers,
    viewsCount,
    activeUsers,
    loading,
    error,
    debugInfo: combinedDebugInfo,
    dateRange,
    isDateFilterActive,
    handleDateRangeChange,
    toggleDateFilter,
    hasAnyData
  };
};
