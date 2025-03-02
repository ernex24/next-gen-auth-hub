
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { SalesData, Customer } from './types';
import { filterDataByDateRange } from './utils';

export const useDateFilter = (
  allSalesData: SalesData[],
  allCustomers: Customer[]
) => {
  const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 13),
    to: new Date(),
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Update the filtered data whenever allSalesData, allCustomers, dateRange, or isDateFilterActive changes
  useEffect(() => {
    console.log("Date filter effect running with:", {
      salesDataLength: allSalesData?.length || 0,
      customersLength: allCustomers?.length || 0,
      isDateFilterActive,
      dateRange
    });

    // Safety check for null/undefined data
    if (!allSalesData || !allCustomers) {
      console.log("No data available for filtering yet");
      setSalesData([]);
      setCustomers([]);
      return;
    }

    // When filter is active and we have a valid date range
    if (isDateFilterActive && dateRange?.from && dateRange?.to) {
      try {
        console.log("Filtering data for date range:", dateRange.from, "to", dateRange.to);
        
        const { filteredSalesData, filteredCustomers } = filterDataByDateRange(
          allSalesData,
          allCustomers,
          dateRange
        );
        
        console.log("Filtered sales data:", filteredSalesData.length, "records");
        setSalesData(filteredSalesData);
        
        console.log("Filtered customers:", filteredCustomers.length, "records");
        setCustomers(filteredCustomers.slice(0, 5));
      } catch (err) {
        console.error("Error filtering by date range:", err);
        // Continue with unfiltered data if there's an error
        setSalesData(allSalesData);
        setCustomers(allCustomers.slice(0, 5));
      }
    } else {
      // When date filter is turned off or no valid range, show all data
      console.log("Date filter inactive, showing all data");
      setSalesData(allSalesData);
      setCustomers(allCustomers.slice(0, 5));
    }
  }, [dateRange, allSalesData, allCustomers, isDateFilterActive]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    console.log("Date range changed to:", range);
    setDateRange(range);
    // If a date range is selected, activate filtering
    if (range?.from && range?.to) {
      setIsDateFilterActive(true);
    }
  };

  const toggleDateFilter = (active: boolean) => {
    console.log("Date filter toggled:", active);
    setIsDateFilterActive(active);
  };

  return {
    salesData,
    customers,
    dateRange,
    isDateFilterActive,
    handleDateRangeChange,
    toggleDateFilter,
  };
};
