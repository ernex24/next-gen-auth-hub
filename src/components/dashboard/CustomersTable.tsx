
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Customer {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
  purchase_date: string;
  total_revenue: number;
}

interface CustomersTableProps {
  customers: Customer[];
}

const CustomersTable = ({ customers }: CustomersTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>Your most recent customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left font-medium">Name</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">{customer.name}</td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      customer.subscription_status === 'Subscribed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {customer.subscription_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">${customer.total_revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomersTable;
