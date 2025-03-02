
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentageChange?: number;
  percentageLabel?: string;
  subtitle?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  percentageChange, 
  percentageLabel,
  subtitle 
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentageChange !== undefined && (
          <div className="flex items-center text-xs text-green-500 mt-1">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            <span>{percentageChange}%</span>
            <span className="text-muted-foreground ml-1">{percentageLabel || "from last month"}</span>
          </div>
        )}
        {subtitle && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span>{subtitle}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
