
import React from 'react';
import { BarChart3 } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <BarChart3 className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No data available</h2>
      <p className="text-muted-foreground max-w-md">
        Your dashboard is ready but there's no data to display yet. Data will appear here once it's available in your database.
      </p>
    </div>
  );
};

export default EmptyState;
