
import { isWithinInterval, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { SalesData, Customer } from './types';

export const filterDataByDateRange = (
  allSalesData: SalesData[],
  allCustomers: Customer[],
  dateRange: DateRange
) => {
  const filteredSalesData = allSalesData.filter(item => {
    if (!item.fullDate) return false;
    const itemDate = parseISO(item.fullDate);
    return isWithinInterval(itemDate, { 
      start: dateRange.from!, 
      end: dateRange.to! 
    });
  });

  const filteredCustomers = allCustomers.filter(customer => {
    const purchaseDate = parseISO(customer.purchase_date);
    return isWithinInterval(purchaseDate, { 
      start: dateRange.from!, 
      end: dateRange.to! 
    });
  });

  return {
    filteredSalesData,
    filteredCustomers
  };
};
