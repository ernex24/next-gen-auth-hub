
import React from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from './DateRangePicker';

interface DashboardHeaderProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DashboardHeader = ({ dateRange, onDateRangeChange }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your dashboard</p>
      </div>
      <div className="mt-4 md:mt-0">
        <DateRangePicker 
          dateRange={dateRange} 
          onDateRangeChange={onDateRangeChange} 
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
