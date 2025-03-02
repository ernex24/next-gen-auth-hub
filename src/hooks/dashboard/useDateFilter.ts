
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
  const [salesData, setSalesData] = useState<SalesData[]>(allSalesData);
  const [customers, setCustomers] = useState<Customer[]>(
    allCustomers.slice(0, 5)
  );

  useEffect(() => {
    if (isDateFilterActive && dateRange?.from && dateRange?.to && allSalesData.length > 0) {
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
    dateRange,
    isDateFilterActive,
    handleDateRangeChange,
    toggleDateFilter,
  };
};
