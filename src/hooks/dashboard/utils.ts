
import { isWithinInterval, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { SalesData, Customer } from './types';

export const filterDataByDateRange = (
  allSalesData: SalesData[],
  allCustomers: Customer[],
  dateRange: DateRange
) => {
  // Check if the date range is valid before filtering
  if (!dateRange?.from || !dateRange?.to) {
    console.log("Invalid date range for filtering:", dateRange);
    return {
      filteredSalesData: allSalesData,
      filteredCustomers: allCustomers
    };
  }

  try {
    const filteredSalesData = allSalesData.filter(item => {
      if (!item.fullDate) {
        console.log("Sales data item missing fullDate:", item);
        return false;
      }
      
      try {
        const itemDate = parseISO(item.fullDate);
        return isWithinInterval(itemDate, { 
          start: dateRange.from!, 
          end: dateRange.to! 
        });
      } catch (err) {
        console.error("Error parsing date for sales item:", item, err);
        return false;
      }
    });

    const filteredCustomers = allCustomers.filter(customer => {
      if (!customer.purchase_date) {
        console.log("Customer missing purchase_date:", customer);
        return false;
      }
      
      try {
        const purchaseDate = parseISO(customer.purchase_date);
        return isWithinInterval(purchaseDate, { 
          start: dateRange.from!, 
          end: dateRange.to! 
        });
      } catch (err) {
        console.error("Error parsing date for customer:", customer, err);
        return false;
      }
    });

    console.log("Date filtering results:", {
      totalSales: allSalesData.length,
      filteredSales: filteredSalesData.length,
      totalCustomers: allCustomers.length,
      filteredCustomers: filteredCustomers.length,
      dateRange
    });

    return {
      filteredSalesData,
      filteredCustomers
    };
  } catch (error) {
    console.error("Error during date filtering:", error);
    // Return original data on error
    return {
      filteredSalesData: allSalesData,
      filteredCustomers: allCustomers
    };
  }
};
