
import React from 'react';
import { BarChart3, Users, Eye } from 'lucide-react';
import StatCard from './StatCard';
import { formatCurrency, formatLargeNumber } from './utils';

interface StatsOverviewProps {
  salesData: { date: string; amount: number }[];
  customers: any[];
  activeUsers: number;
  viewsCount: number;
}

const StatsOverview = ({ salesData, customers, activeUsers, viewsCount }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Revenue" 
        value={salesData.length > 0 
          ? formatCurrency(salesData.reduce((sum, item) => sum + item.amount, 0)) 
          : formatCurrency(0)}
        icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />}
        percentageChange={12.5}
      />

      <StatCard 
        title="Subscriptions" 
        value={customers.length}
        icon={<Users className="w-4 h-4 text-muted-foreground" />}
        percentageChange={4.2}
      />

      <StatCard 
        title="Active Now" 
        value={activeUsers}
        icon={<Users className="w-4 h-4 text-muted-foreground" />}
        subtitle="Active users right now"
      />

      <StatCard 
        title="Page Views" 
        value={formatLargeNumber(viewsCount)}
        icon={<Eye className="w-4 h-4 text-muted-foreground" />}
        percentageChange={7.3}
      />
    </div>
  );
};

export default StatsOverview;
