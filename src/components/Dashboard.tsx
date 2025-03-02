
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import LoadingState from './dashboard/LoadingState';
import EmptyState from './dashboard/EmptyState';
import DashboardHeader from './dashboard/DashboardHeader';
import StatsOverview from './dashboard/StatsOverview';
import DashboardContent from './dashboard/DashboardContent';

const Dashboard = () => {
  const {
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
  } = useDashboardData();

  if (loading) {
    return <LoadingState debug={true} error={error} />;
  }

  if (!hasAnyData) {
    return (
      <div className="container px-6 py-8 mx-auto">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
        <EmptyState message={
          debugInfo ? `${debugInfo}` : "No data available yet. Data will appear here once it's generated."
        } />
      </div>
    );
  }

  return (
    <div className="container px-6 py-8 mx-auto">
      <DashboardHeader 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange}
        isDateFilterActive={isDateFilterActive}
        onToggleDateFilter={toggleDateFilter}
      />
      
      <StatsOverview 
        salesData={salesData}
        customers={customers}
        activeUsers={activeUsers}
        viewsCount={viewsCount}
      />
      
      <DashboardContent 
        salesData={salesData}
        customers={customers}
        error={error}
        debugInfo={debugInfo}
      />
    </div>
  );
};

export default Dashboard;
