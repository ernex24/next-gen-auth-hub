
import React from 'react';
import { FolderIcon, CalendarIcon } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  isDateFiltered?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No data available yet. Data will appear here once it's generated.",
  isDateFiltered = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        {isDateFiltered ? (
          <CalendarIcon className="h-6 w-6 text-primary" />
        ) : (
          <FolderIcon className="h-6 w-6 text-primary" />
        )}
      </div>
      <h3 className="text-lg font-medium">
        {isDateFiltered ? "No data in selected date range" : "No data to display"}
      </h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
