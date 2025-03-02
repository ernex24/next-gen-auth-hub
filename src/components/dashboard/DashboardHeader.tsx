
import React from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from './DateRangePicker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DashboardHeaderProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  isDateFilterActive?: boolean;
  onToggleDateFilter?: (active: boolean) => void;
}

const DashboardHeader = ({ 
  dateRange, 
  onDateRangeChange,
  isDateFilterActive = false,
  onToggleDateFilter
}: DashboardHeaderProps) => {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            {isDateFilterActive 
              ? "Viewing data for selected date range" 
              : "Viewing all data"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="date-filter"
              checked={isDateFilterActive}
              onCheckedChange={onToggleDateFilter}
            />
            <Label htmlFor="date-filter">Filter by date</Label>
          </div>
          
          {isDateFilterActive && (
            <DateRangePicker 
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
