
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
    hasAnyData
  };
};
