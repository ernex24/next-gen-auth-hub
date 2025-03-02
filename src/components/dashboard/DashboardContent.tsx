
import React from 'react';
import RevenueChart from './RevenueChart';
import CustomersTable from './CustomersTable';
import EmptyState from './EmptyState';
import { formatCurrency } from './utils';

interface DashboardContentProps {
  salesData: { date: string; amount: number }[];
  customers: any[];
  error: string | null;
  debugInfo: string | null;
}

const DashboardContent = ({ salesData, customers, error, debugInfo }: DashboardContentProps) => {
  const hasFilteredData = salesData.length > 0 || customers.length > 0;

  return (
    <>
      {salesData.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mt-8">
          <RevenueChart salesData={salesData} formatCurrency={formatCurrency} />
        </div>
      )}
      
      {customers.length > 0 && (
        <div className="mt-8">
          <CustomersTable customers={customers} />
        </div>
      )}
      
      {!hasFilteredData && (
        <div className="mt-8">
          <EmptyState 
            isDateFiltered={true}
            message="There is no data available for the selected time period. Try selecting a different date range or check if data exists in the system." 
          />
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 rounded-md text-destructive">
          {error}
        </div>
      )}
      
      {debugInfo && (
        <div className="mt-6 p-4 bg-muted rounded-md">
          <h3 className="font-medium">Debug Information:</h3>
          <pre className="text-xs mt-2 whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
    </>
  );
};

export default DashboardContent;
